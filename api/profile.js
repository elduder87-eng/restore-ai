export default function handler(req, res) {
  try {
    const memory = {
      name: global.userName || null,
      interests: global.userInterests || []
    };

    res.status(200).json(memory);
  } catch (error) {
    res.status(500).json({
      error: "Could not load profile"
    });
  }
}
