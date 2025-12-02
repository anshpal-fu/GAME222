// Health Avatar Character - Heart Doctor Coach
// A friendly, motivational health avatar inspired by a heart doctor coach

const healthAvatar = {
  name: "Dr. Heart",
  role: "Health Coach",
  style: {
    type: "modern_2d",
    outline: "clean_minimal",
    shadows: "soft",
    gradients: "soft"
  },
  colorTheme: {
    primary: "#FF0000", // Red
    secondary: "#FFFFFF", // White
    accent: "#0000FF" // Blue
  },
  features: {
    badge: {
      shape: "heart",
      position: "chest"
    },
    expressions: {
      happy: {
        mouth: "smile",
        eyes: "closedHappy",
        eyebrows: "relaxed"
      },
      worried: {
        mouth: "frown",
        eyes: "concerned",
        eyebrows: "knit"
      },
      thinking: {
        mouth: "neutral",
        eyes: "thoughtful",
        eyebrows: "raised"
      }
    }
  },
  personality: {
    tone: "friendly",
    approach: "motivational",
    style: "supportive"
  }
};

export default healthAvatar;