package com.example.ai_recruiter.keys;



import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

@Component
public class RsaKeyProvider {

    private final PublicKey publicKey;
    private final PrivateKey privateKey;

    public RsaKeyProvider(
            @Value("${app.crypto.rsa.public-key-path}") Resource publicKeyResource,
            @Value("${app.crypto.rsa.private-key-path}") Resource privateKeyResource
    ) throws Exception {
        this.publicKey = loadPublicKey(publicKeyResource);
        this.privateKey = loadPrivateKey(privateKeyResource);
    }

    private PublicKey loadPublicKey(Resource resource) throws Exception {
        byte[] keyBytes = resource.getInputStream().readAllBytes();
        String key = new String(keyBytes)
                .replace("-----BEGIN PUBLIC KEY-----", "")
                .replace("-----END PUBLIC KEY-----", "")
                .replaceAll("\\s", "");
        X509EncodedKeySpec spec = new X509EncodedKeySpec(Base64.getDecoder().decode(key));
        return KeyFactory.getInstance("RSA").generatePublic(spec);
    }

    private PrivateKey loadPrivateKey(Resource resource) throws Exception {
        byte[] keyBytes = resource.getInputStream().readAllBytes();
        String key = new String(keyBytes)
                .replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replaceAll("\\s", "");
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(Base64.getDecoder().decode(key));
        return KeyFactory.getInstance("RSA").generatePrivate(spec);
    }

    public PublicKey getPublicKey() { return publicKey; }
    public PrivateKey getPrivateKey() { return privateKey; }
}
