import { SignupFormSchema, SigninFormState } from "@/app/lib/definition";
import AppClient from "@/components/Apwr";
import { Account, Databases, ID, Storage } from "appwrite";

export async function signup(state: SigninFormState, formData: FormData) {

    const validatedFields = SignupFormSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const account = new Account(AppClient);

    const user = await account.create(
        ID.unique(),
        validatedFields.data.email,
        validatedFields.data.password,
        validatedFields.data.name,
    );
    const databases = new Databases(AppClient);

    const avatar =
        "https://images.unsplash.com/vector-1742735484705-b30abeec6350?q=80&w=927&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

    const promise = databases.createDocument(
        "68544c88002c4a532128",
        "68544c9a0007efc0a947",
        ID.unique(),
        {
            name: user.name,
            avatar: avatar,
            totalPoints: 0,
            rank: 0,
            completedChallenges: 0,
            adventure: 0,
            cultural: 0,
            food: 0,
            nature: 0,
            recentevents: [],
        },
    );

    promise.then(function (response) {
        console.log(response);
        return {
            success: true,
            user: response,
        };
    }, function (error) {
        console.log(error);
        return {
            success: true,
            user: error,
        };
    });


}
