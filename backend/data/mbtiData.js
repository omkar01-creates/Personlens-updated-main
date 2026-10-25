// Simple static information for all 16 MBTI personality types.
const mbtiData = {
  INTJ: {
    name: "Architect",
    description:
      "Imaginative and strategic thinkers with a plan for everything. INTJs are analytical, independent and driven by their own ideas and vision.",
    strengths: ["Strategic thinking", "Independent", "Determined", "Hard-working"],
    weaknesses: ["Overly critical", "Dislikes rules", "Can be arrogant", "Impatient"],
    communicationStyle: "Direct, logical and to the point. Prefers meaningful discussions over small talk.",
    improvementAreas: ["Show more empathy", "Be open to others' ideas", "Improve patience"],
  },
  INTP: {
    name: "Logician",
    description:
      "Innovative inventors with an unquenchable thirst for knowledge. INTPs love exploring ideas, theories and possibilities.",
    strengths: ["Analytical", "Original thinking", "Open-minded", "Objective"],
    weaknesses: ["Disconnected", "Insensitive", "Absent-minded", "Dislikes rules"],
    communicationStyle: "Logical and precise. Enjoys debating ideas and abstract concepts.",
    improvementAreas: ["Follow through on tasks", "Express feelings", "Improve organisation"],
  },
  ENTJ: {
    name: "Commander",
    description:
      "Bold, imaginative and strong-willed leaders, always finding a way or making one. ENTJs are natural leaders who love a challenge.",
    strengths: ["Efficient", "Confident", "Strong-willed", "Strategic leader"],
    weaknesses: ["Stubborn", "Impatient", "Arrogant", "Poor handling of emotions"],
    communicationStyle: "Assertive, confident and results-driven. Speaks with authority and clarity.",
    improvementAreas: ["Listen more", "Show empathy", "Be patient with others"],
  },
  ENTP: {
    name: "Debater",
    description:
      "Smart and curious thinkers who cannot resist an intellectual challenge. ENTPs love brainstorming and debating ideas.",
    strengths: ["Knowledgeable", "Quick thinker", "Charismatic", "Energetic"],
    weaknesses: ["Argumentative", "Insensitive", "Dislikes routine", "Easily bored"],
    communicationStyle: "Energetic and persuasive. Enjoys lively debates and exploring new ideas.",
    improvementAreas: ["Finish what you start", "Be more considerate", "Respect routine"],
  },
  INFJ: {
    name: "Advocate",
    description:
      "Quiet and mystical, yet inspiring and idealistic. INFJs are creative, caring and driven by strong personal values.",
    strengths: ["Insightful", "Principled", "Passionate", "Altruistic"],
    weaknesses: ["Sensitive to criticism", "Perfectionist", "Private", "Burns out easily"],
    communicationStyle: "Warm, thoughtful and empathetic. Prefers deep and meaningful conversations.",
    improvementAreas: ["Accept imperfection", "Set boundaries", "Handle criticism"],
  },
  INFP: {
    name: "Mediator",
    description:
      "Poetic, kind and altruistic people, always eager to help a good cause. INFPs are guided by their values and imagination.",
    strengths: ["Empathetic", "Creative", "Idealistic", "Open-minded"],
    weaknesses: ["Overly idealistic", "Impractical", "Takes things personally", "Self-critical"],
    communicationStyle: "Gentle, supportive and values-based. Communicates with warmth and sincerity.",
    improvementAreas: ["Be more practical", "Accept feedback", "Improve focus"],
  },
  ENFJ: {
    name: "Protagonist",
    description:
      "Charismatic and inspiring leaders, able to mesmerise their listeners. ENFJs are warm, caring and love helping others grow.",
    strengths: ["Charismatic", "Reliable", "Altruistic", "Natural leader"],
    weaknesses: ["Overly idealistic", "Too selfless", "Sensitive", "Struggles to say no"],
    communicationStyle: "Encouraging and inspiring. Great at motivating and connecting with people.",
    improvementAreas: ["Take care of yourself", "Accept criticism", "Set boundaries"],
  },
  ENFP: {
    name: "Campaigner",
    description:
      "Enthusiastic, creative and sociable free spirits, who can always find a reason to smile. ENFPs are curious and full of energy.",
    strengths: ["Enthusiastic", "Creative", "Sociable", "Curious"],
    weaknesses: ["Unfocused", "Disorganised", "Overthinks", "Easily stressed"],
    communicationStyle: "Warm, expressive and enthusiastic. Enjoys connecting with people and sharing ideas.",
    improvementAreas: ["Improve focus", "Follow through", "Manage stress"],
  },
  ISTJ: {
    name: "Logistician",
    description:
      "Practical and fact-minded individuals, whose reliability cannot be doubted. ISTJs value tradition, order and responsibility.",
    strengths: ["Honest", "Responsible", "Practical", "Organised"],
    weaknesses: ["Stubborn", "Insensitive", "Judgemental", "Resistant to change"],
    communicationStyle: "Clear, factual and structured. Prefers straightforward and practical communication.",
    improvementAreas: ["Be flexible", "Show emotions", "Accept new ideas"],
  },
  ISFJ: {
    name: "Defender",
    description:
      "Very dedicated and warm protectors, always ready to defend their loved ones. ISFJs are supportive, loyal and caring.",
    strengths: ["Supportive", "Reliable", "Patient", "Loyal"],
    weaknesses: ["Overly humble", "Takes things personally", "Avoids conflict", "Overworks"],
    communicationStyle: "Kind, considerate and supportive. Listens carefully and avoids conflict.",
    improvementAreas: ["Speak up for yourself", "Say no", "Embrace change"],
  },
  ESTJ: {
    name: "Executive",
    description:
      "Excellent administrators, unsurpassed at managing things or people. ESTJs are organised, dependable and value order.",
    strengths: ["Dedicated", "Organised", "Direct", "Strong-willed"],
    weaknesses: ["Inflexible", "Judgemental", "Stubborn", "Difficulty relaxing"],
    communicationStyle: "Direct, organised and decisive. Values clear rules and expectations.",
    improvementAreas: ["Be flexible", "Show empathy", "Consider other views"],
  },
  ESFJ: {
    name: "Consul",
    description:
      "Extraordinarily caring, social and popular people, always eager to help. ESFJs value harmony and community.",
    strengths: ["Caring", "Loyal", "Warm", "Good organiser"],
    weaknesses: ["Needs approval", "Sensitive to criticism", "Inflexible", "Avoids conflict"],
    communicationStyle: "Friendly, warm and cooperative. Focused on harmony and helping others.",
    improvementAreas: ["Accept criticism", "Be independent", "Handle conflict"],
  },
  ISTP: {
    name: "Virtuoso",
    description:
      "Bold and practical experimenters, masters of all kinds of tools. ISTPs are hands-on, logical and love to explore how things work.",
    strengths: ["Practical", "Creative", "Spontaneous", "Calm in crisis"],
    weaknesses: ["Private", "Easily bored", "Risky behaviour", "Dislikes commitment"],
    communicationStyle: "Practical and to the point. Prefers action over long discussions.",
    improvementAreas: ["Open up more", "Plan ahead", "Commit to goals"],
  },
  ISFP: {
    name: "Adventurer",
    description:
      "Flexible and charming artists, always ready to explore new things. ISFPs are gentle, creative and live in the moment.",
    strengths: ["Charming", "Creative", "Sensitive", "Curious"],
    weaknesses: ["Unpredictable", "Easily stressed", "Overly competitive", "Independent to a fault"],
    communicationStyle: "Gentle, expressive and easy-going. Communicates through actions and creativity.",
    improvementAreas: ["Plan for the future", "Manage stress", "Be more open"],
  },
  ESTP: {
    name: "Entrepreneur",
    description:
      "Smart, energetic and very perceptive people, who truly enjoy living on the edge. ESTPs are action-oriented and bold.",
    strengths: ["Bold", "Practical", "Sociable", "Perceptive"],
    weaknesses: ["Impatient", "Risk-prone", "Blunt", "Dislikes routine"],
    communicationStyle: "Direct, energetic and persuasive. Enjoys fast-paced, practical conversations.",
    improvementAreas: ["Think before acting", "Be patient", "Consider consequences"],
  },
  ESFP: {
    name: "Entertainer",
    description:
      "Spontaneous, energetic and enthusiastic people. ESFPs love life, people and having a good time.",
    strengths: ["Enthusiastic", "Friendly", "Practical", "Observant"],
    weaknesses: ["Easily bored", "Poor planning", "Sensitive", "Avoids conflict"],
    communicationStyle: "Fun, lively and warm. Loves engaging and entertaining others.",
    improvementAreas: ["Plan ahead", "Focus on goals", "Handle criticism"],
  },
};

module.exports = mbtiData;
