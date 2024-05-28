export default async (req, res) => {
  try {
    const response = await fetch("https://api.uomg.com/api/rand.qinghua");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
