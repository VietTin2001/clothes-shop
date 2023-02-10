import bcrypt from "bcryptjs"

const users =[
    {
        name: "Admin",
        email: "admin@gmail.com",
        passWord: bcrypt.hashSync("123456",10),
        isAdmin: true
    },
    {
        name: "User",
        email: "user@gmail.com",
        passWord: bcrypt.hashSync("123456",10)
    }

]

export default users