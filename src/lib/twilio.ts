import twilio from "twilio"

let _twilio: ReturnType<typeof twilio> | null = null

export function getTwilio(): ReturnType<typeof twilio> {
  if (!_twilio) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    if (!accountSid || !authToken) {
      throw new Error("TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN is not set")
    }
    _twilio = twilio(accountSid, authToken)
  }
  return _twilio
}
