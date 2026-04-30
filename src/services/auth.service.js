import { db } from "#config/database.js"
import logger from "#config/logger.js"
import bcrypt from 'bcrypt'
import { eq, ne } from "drizzle-orm"
import {user} from '#models/user.model.js'

export const hashPassword = async (password) => {
    try {
        return bcrypt.hash(password, 10)
    } catch (e) {
        logger.error('Error hashing the password', e)
        throw new Error('Error hashing')
    }
}

export const createUser = async ({name, email, password, role = 'user'}) => {
    try {
       const existingUser = db.select().from(user).where(eq(user.email, email)).limit(1)

       if((await existingUser).length > 0) throw new Error('User with this email already exists')

        const password_hash = await hashPassword(password)

        const [newUser] = await db.insert(user).values({
            name, email, password:password_hash, role
        })
        .returning({id:user.id, name: user.name, email: user.email, role: user.role, created_at: user.created_at})

        logger.info(`User ${newUser.email } created successfully`)
        return newUser
    } catch (e) {
        logger.error('Error creating the user', e)
        throw e;
    }
}