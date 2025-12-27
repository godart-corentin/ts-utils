import { obj, str, bool } from "../src/validator";

const userSchema = obj({
    firstName: str(),
    lastName: str(),
    email: str(),
    isActive: bool(),
});

const user = {
    firstName: 'Corentin',
    lastName: 'Dupont',
    email: 'corentin.dupont@gmail.com',
}

const result = userSchema.safeParse(user);

if (result.type === 'success') {
    console.log('Valid user', result.data);
} else {
    console.log('Invalid user', result.issues);
}