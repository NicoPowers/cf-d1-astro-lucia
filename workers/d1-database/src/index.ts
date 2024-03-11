import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { drizzle } from 'drizzle-orm/d1'
import { users } from './schema';

import { faker } from '@faker-js/faker';



export interface Env {
	// If you set another name in wrangler.toml as the value for 'binding',
	// replace "DB" with the variable name you defined.
	DB: D1Database;
  }
  
  export default {
	async fetch(request: Request, env: Env) {
	  const { pathname } = new URL(request.url);
  
	  if (pathname === "/api/beverages") {
		const db = drizzle(env.DB);

		// If you did not use `DB` as your binding name, change it here
		const results = await db.select().from(users).all()
		return Response.json(results);
	  }

	  if (pathname === "/api/seed") {
		// generate 10 fake users
		// each user just needs an id of type text (lets just use a uuid)
		const db = drizzle(env.DB);
		for (let i = 0; i < 10; i++) {
			const id = faker.string.uuid();
			await db.insert(users).values({ id }).execute();
	  	}
		return new Response("10 fake users seeded");
	  }

  
	  return new Response(
		"Call /api/beverages to see everyone who works at Bs Beverages"
	  );
	},
  };