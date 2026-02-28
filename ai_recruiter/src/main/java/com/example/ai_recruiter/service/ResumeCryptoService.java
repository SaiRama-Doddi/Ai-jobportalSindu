package com.example.ai_recruiter.service;

import com.example.ai_recruiter.keys.RsaKeyProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.crypto.*;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
public class ResumeCryptoService {

    private static final int GCM_TAG_LENGTH = 128; // bits
    private static final int GCM_IV_LENGTH = 12;   // bytes

    private final RsaKeyProvider rsaKeyProvider;

    // ================= ENCRYPT =================
    public EncryptionResult encrypt(byte[] fileBytes) throws Exception {

        // 1️⃣ Generate AES key
        KeyGenerator keyGen = KeyGenerator.getInstance("AES");
        keyGen.init(256);
        SecretKey aesKey = keyGen.generateKey();

        // 2️⃣ Generate IV
        byte[] iv = new byte[GCM_IV_LENGTH];
        SecureRandom random = new SecureRandom();
        random.nextBytes(iv);

        // 3️⃣ Encrypt file using AES-GCM
        Cipher aesCipher = Cipher.getInstance("AES/GCM/NoPadding");
        aesCipher.init(
                Cipher.ENCRYPT_MODE,
                aesKey,
                new GCMParameterSpec(GCM_TAG_LENGTH, iv)
        );
        byte[] encryptedFile = aesCipher.doFinal(fileBytes);

        // 4️⃣ Encrypt AES key using RSA (OAEP – SAFE)
        Cipher rsaCipher = Cipher.getInstance("RSA/ECB/OAEPWithSHA-256AndMGF1Padding");
        rsaCipher.init(Cipher.ENCRYPT_MODE, rsaKeyProvider.getPublicKey());
        byte[] encryptedAesKey = rsaCipher.doFinal(aesKey.getEncoded());

        return new EncryptionResult(encryptedFile, encryptedAesKey, iv);
    }

    // ================= DECRYPT =================
    public byte[] decrypt(byte[] encryptedFile, byte[] encryptedAesKey, byte[] iv) throws Exception {

        // 1️⃣ Decrypt AES key using RSA
        Cipher rsaCipher = Cipher.getInstance("RSA/ECB/OAEPWithSHA-256AndMGF1Padding");
        rsaCipher.init(Cipher.DECRYPT_MODE, rsaKeyProvider.getPrivateKey());
        byte[] aesKeyBytes = rsaCipher.doFinal(encryptedAesKey);

        SecretKey aesKey = new SecretKeySpec(aesKeyBytes, "AES");

        // 2️⃣ Decrypt file using AES-GCM
        Cipher aesCipher = Cipher.getInstance("AES/GCM/NoPadding");
        aesCipher.init(
                Cipher.DECRYPT_MODE,
                aesKey,
                new GCMParameterSpec(GCM_TAG_LENGTH, iv)
        );
        return aesCipher.doFinal(encryptedFile);
    }

    // ================= RESULT =================
    public record EncryptionResult(
            byte[] encryptedFile,
            byte[] encryptedAesKey,
            byte[] iv
    ) {}
}
