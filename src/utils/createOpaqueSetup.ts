import * as opaque from "@serenity-kit/opaque";

await opaque.ready;

console.log("Generating OPAQUE server setup...");
console.log(`'${opaque.server.createSetup()}'`);
console.log(
    "Please set OPAQUE_SERVER_SETUP to the above value in your .env file",
);
