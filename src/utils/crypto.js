import sodium from 'libsodium-wrappers';

// Initialize libsodium
export async function initCrypto() {
    await sodium.ready;
    return sodium;
}

// Function to generate key pairs
export async function generateKeyPair() {
    await sodium.ready;
    const keyPair = sodium.crypto_box_keypair();
    return {
        publicKey: sodium.to_base64(keyPair.publicKey),
        privateKey: sodium.to_base64(keyPair.privateKey)
    };
}

export default sodium;
