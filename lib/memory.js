let profile = {
  name: null,
  interests: [],
};

export function getProfile() {
  return profile;
}

export function setName(name) {
  profile.name = name;
}

export function addInterest(interest) {
  if (!profile.interests.includes(interest)) {
    profile.interests.push(interest);
  }
}
