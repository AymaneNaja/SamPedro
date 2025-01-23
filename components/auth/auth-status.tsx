import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"

export default async function AuthStatus() {
    const session = await getServerSession(authOptions)

    return (
        <div>
            {session?.user && (
                <p className="text-sm text-muted-foreground">
                    Signed in as {session.user.email}
                </p>
            )}
        </div>
    )
}

