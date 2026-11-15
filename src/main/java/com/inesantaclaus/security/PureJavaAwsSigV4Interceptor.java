package com.inesantaclaus.security;

import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.TreeMap;
import java.util.stream.Collectors;

public class PureJavaAwsSigV4Interceptor implements ClientHttpRequestInterceptor {

    private final String accessKey;
    private final String secretKey;
    private final String region;
    private final String service;

    private static final DateTimeFormatter ISO_8601_BASIC = DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss'Z'");
    private static final DateTimeFormatter DATE_STAMP = DateTimeFormatter.ofPattern("yyyyMMdd");
    private static final char[] HEX_ARRAY = "0123456789abcdef".toCharArray();

    public PureJavaAwsSigV4Interceptor(String accessKey, String secretKey, String region, String service) {
        this.accessKey = accessKey;
        this.secretKey = secretKey;
        this.region = region;
        this.service = service;
    }

    @Override
    public ClientHttpResponse intercept(HttpRequest request, byte[] body, ClientHttpRequestExecution execution) throws IOException {
        ZonedDateTime now = ZonedDateTime.now(ZoneOffset.UTC);
        String amzDate = now.format(ISO_8601_BASIC);
        String dateStamp = now.format(DATE_STAMP);

        // 1. Hash the payload
        String payloadHash = sha256Hex(body);

        // 2. Set required AWS headers before signing
        URI uri = request.getURI();
        String host = uri.getHost() + (uri.getPort() != -1 ? ":" + uri.getPort() : "");
        request.getHeaders().set("Host", host);
        request.getHeaders().set("x-amz-date", amzDate);
        request.getHeaders().set("x-amz-content-sha256", payloadHash);

        // 3. Build Canonical Headers & Signed Headers
        TreeMap<String, String> sortedHeaders = new TreeMap<>();
        request.getHeaders().forEach((key, values) -> {
            String lowerKey = key.toLowerCase();
            if (lowerKey.equals("host") || lowerKey.startsWith("x-amz-") || lowerKey.equals("content-type")) {
                sortedHeaders.put(lowerKey, String.join(",", values).trim());
            }
        });

        String canonicalHeaders = sortedHeaders.entrySet().stream()
                .map(e -> e.getKey() + ":" + e.getValue() + "\n")
                .collect(Collectors.joining());

        String signedHeaders = String.join(";", sortedHeaders.keySet());

        // 4. Build Canonical Request
        String canonicalUri = (uri.getRawPath() == null || uri.getRawPath().isEmpty()) ? "/" : uri.getRawPath();
        String canonicalQueryString = getCanonicalQueryString(uri.getRawQuery());

        String canonicalRequest = String.join("\n",
                request.getMethodValue(),
                canonicalUri,
                canonicalQueryString,
                canonicalHeaders,
                signedHeaders,
                payloadHash
        );

        // 5. Build String to Sign
        String credentialScope = String.join("/", dateStamp, region, service, "aws4_request");
        String stringToSign = String.join("\n",
                "AWS4-HMAC-SHA256",
                amzDate,
                credentialScope,
                sha256Hex(canonicalRequest.getBytes(StandardCharsets.UTF_8))
        );

        // 6. Calculate Signature
        byte[] signingKey = getSignatureKey(secretKey, dateStamp, region, service);
        String signature = hmacSha256Hex(signingKey, stringToSign);

        // 7. Attach Authorization Header
        String authorizationHeader = String.format(
                "AWS4-HMAC-SHA256 Credential=%s/%s, SignedHeaders=%s, Signature=%s",
                accessKey, credentialScope, signedHeaders, signature
        );
        request.getHeaders().set("Authorization", authorizationHeader);

        //System.out.println(authorizationHeader);
        return execution.execute(request, body);
    }

    private String getCanonicalQueryString(String rawQuery) {
        if (rawQuery == null || rawQuery.isEmpty()) return "";
        TreeMap<String, String> params = new TreeMap<>();
        for (String param : rawQuery.split("&")) {
            String[] pair = param.split("=", 2);
            String key = pair[0];
            String val = pair.length > 1 ? pair[1] : "";
            params.put(key, val);
        }
        return params.entrySet().stream()
                .map(e -> e.getKey() + "=" + e.getValue())
                .collect(Collectors.joining("&"));
    }

    private byte[] getSignatureKey(String key, String dateStamp, String regionName, String serviceName) {
        byte[] kSecret = ("AWS4" + key).getBytes(StandardCharsets.UTF_8);
        byte[] kDate = hmacSha256(kSecret, dateStamp);
        byte[] kRegion = hmacSha256(kDate, regionName);
        byte[] kService = hmacSha256(kRegion, serviceName);
        return hmacSha256(kService, "aws4_request");
    }

    private byte[] hmacSha256(byte[] key, String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(key, "HmacSHA256"));
            return mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            throw new RuntimeException("Failed to calculate HMAC-SHA256", e);
        }
    }

    private String hmacSha256Hex(byte[] key, String data) {
        return bytesToHex(hmacSha256(key, data));
    }

    private String sha256Hex(byte[] data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return bytesToHex(digest.digest(data != null ? data : new byte[0]));
        } catch (Exception e) {
            throw new RuntimeException("Failed to calculate SHA-256", e);
        }
    }

    private static String bytesToHex(byte[] bytes) {
        char[] hexChars = new char[bytes.length * 2];
        for (int j = 0; j < bytes.length; j++) {
            int v = bytes[j] & 0xFF;
            hexChars[j * 2] = HEX_ARRAY[v >>> 4];
            hexChars[j * 2 + 1] = HEX_ARRAY[v & 0x0F];
        }
        return new String(hexChars);
    }
}

