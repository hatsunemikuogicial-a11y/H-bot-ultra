export default async function hola(sock, msg) {
  await sock.sendMessage(msg.key.remoteJid, {
    text: "👋 Hola, el bot ya funciona"
  })
}
