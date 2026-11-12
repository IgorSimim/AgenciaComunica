import { NextResponse } from "next/server"

type ParsePositiveIntegerOptions = {
    missingMessage: string
    invalidMessage: string
}

export class ApiController {
    json<T>(body: T, status = 200) {
        return NextResponse.json(body, { status })
    }

    parsePositiveInteger(
        value: string | undefined,
        options: ParsePositiveIntegerOptions
    ): { value: number } | { response: NextResponse } {
        if (!value) {
            return { response: this.json({ message: options.missingMessage }, 400) }
        }

        const parsedValue = Number(value)
        if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
            return { response: this.json({ message: options.invalidMessage }, 400) }
        }

        return { value: parsedValue }
    }

    handleError(error: unknown, message: string) {
        if (error instanceof SyntaxError) {
            return this.json(
                { message: "Corpo da requisição inválido" },
                400
            )
        }

        console.error(message, error)
        return this.json({ message }, 500)
    }
}

export const apiController = new ApiController()