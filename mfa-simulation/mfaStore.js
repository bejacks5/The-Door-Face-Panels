const mfaChallenges = {};   // { challengeId: username }
const sessionTokens = {};   // { token: username }

module.exports = {
    saveChallenge(challengeId, username) {
        mfaChallenges[challengeId] = username;
    },

    verifyChallenge(challengeId, code) {
        // Sprint 5 has fixed MFA code: 123456
        if (code === "123456" && mfaChallenges[challengeId]) {
            const user = mfaChallenges[challengeId];
            delete mfaChallenges[challengeId];
            return user;
        }
        return null;
    },

    createSessionToken(token, username) {
        sessionTokens[token] = username;
    },

    verifySessionToken(token) {
        return sessionTokens[token] || null;
    },

    deleteSessionToken(token) {
        delete sessionTokens[token];
    }
};
