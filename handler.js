import { prefix } from "../settings.js"
import hola from "./commands/hola.js"

export default async function handler(sock, msg) {
  if (!msg.message) return

  const text = msg.message.conversation || ""
  if (!text.startsWith(prefix)) return

  const command = text.slice(prefix.length).trim()

  if (command === "hola") {
    await hola(sock, msg)
  }
}
