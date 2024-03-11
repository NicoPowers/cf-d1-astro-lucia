import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { initializeLucia } from "./utils/auth"
import { drizzle } from 'drizzle-orm/d1'
import { user } from './schema';
import { faker } from '@faker-js/faker';
import { generateId } from "lucia";
import { argon2id} from "@noble/hashes/argon2";
import { bytesToHex as toHex, randomBytes } from '@noble/hashes/utils';

export interface Env {
	// If you set another name in wrangler.toml as the value for 'binding',
	// replace "DB" with the variable name you defined.
	DB: D1Database;
  }
  
  export default {
	async fetch(request: Request, env: Env) {
	  const { pathname } = new URL(request.url);
  
	  if (pathname === "/users") {
		const db = drizzle(env.DB);

		// If you did not use `DB` as your binding name, change it here
		const results = await db.select().from(user).all()
		return Response.json(results);
	  }

	  if (pathname === "/signup") {
		// Now you can use the generated salt with argon2id
		const hashedPassword = argon2id('password', toHex(randomBytes(32)), { t: 1, m: 65536, p: 1 });
		const userId = generateId(15);

		const db = drizzle(env.DB);

		try {
			await db.insert(user).values({
				id: userId,
				name: faker.person.fullName(),
				username: faker.internet.userName(),
				hashedPassword: toHex(hashedPassword),
			}).execute();
			
			const lucia = initializeLucia(env.DB);
			const session = await lucia.createSession(userId, {});
			console.log("Created Session", session.id)
			const sessionCookie = lucia.createSessionCookie(session.id);
			console.log("Created Cookie", sessionCookie.serialize())
			return new Response(null, {
				status: 302,
				headers: {
					Location: "/",
					"Set-Cookie": sessionCookie.serialize()
				}
			});
		} catch (e) {
			// db error, email taken, etc
			console.log(e);
			return new Response("Email already used", {
				status: 400
			});
		}

	  }

  
	  return new Response(
		"Call /api/beverages to see everyone who works at Bs Beverages"
	  );
	},
  };