import { OPAQUE_SERVER_SETUP } from "@config";
import { logger } from "@logger";
import * as opaque from "@serenity-kit/opaque";

// wait for wasm to load
await opaque.ready;

if (OPAQUE_SERVER_SETUP === "") {
    logger.error("OPAQUE_SERVER_SETUP is not set");
    logger.error("generate one using npm run create-opaque-setup");
    process.exit(1);
}

function startRegistration(email: string, request: string): string {
    const { registrationResponse } = opaque.server.createRegistrationResponse({
        serverSetup: OPAQUE_SERVER_SETUP,
        registrationRequest: request,
        userIdentifier: email,
    });

    return registrationResponse;
}

function startLogin(email: string, record: string, request: string) {
    const { serverLoginState, loginResponse } = opaque.server.startLogin({
        userIdentifier: email,
        registrationRecord: record,
        startLoginRequest: request,
        serverSetup: OPAQUE_SERVER_SETUP,
    });

    return { state: serverLoginState, response: loginResponse };
}

function finishLogin(state: string, request: string) {
    const { sessionKey } = opaque.server.finishLogin({
        serverLoginState: state,
        finishLoginRequest: request,
    });

    return sessionKey;
}

export default {
    startRegistration,
    startLogin,
    finishLogin,
};
