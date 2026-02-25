const identities = {};

export function getIdentity(userId) {
  if (!identities[userId]) {
    identities[userId] = {
      name: null
    };
  }

  return identities[userId];
}

export function updateIdentity(userId, message) {
  const identity = getIdentity(userId);

  const match = message.match(/my name is (.+)/i);

  if (match) {
    identity.name = match[1].trim();
  }

  return identity;
}
