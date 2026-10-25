// 30 simple MBTI-style questions.
// dimension: which pair the question belongs to (EI, SN, TF, JP)
// pole: the letter that "Agree" supports
const questions = [
  { id: 1, text: "I enjoy meeting new people.", dimension: "EI", pole: "E" },
  { id: 2, text: "I feel energised after spending time in a large group.", dimension: "EI", pole: "E" },
  { id: 3, text: "I prefer spending a quiet evening alone rather than at a party.", dimension: "EI", pole: "I" },
  { id: 4, text: "I often start conversations with strangers.", dimension: "EI", pole: "E" },
  { id: 5, text: "I need time alone to recharge my energy.", dimension: "EI", pole: "I" },
  { id: 6, text: "I usually think out loud rather than keep my thoughts to myself.", dimension: "EI", pole: "E" },
  { id: 7, text: "I am comfortable being the centre of attention.", dimension: "EI", pole: "E" },

  { id: 8, text: "I focus more on facts and details than on ideas.", dimension: "SN", pole: "S" },
  { id: 9, text: "I enjoy thinking about the future and new possibilities.", dimension: "SN", pole: "N" },
  { id: 10, text: "I trust practical experience more than theories.", dimension: "SN", pole: "S" },
  { id: 11, text: "I often notice patterns and connections between ideas.", dimension: "SN", pole: "N" },
  { id: 12, text: "I prefer clear, step-by-step instructions.", dimension: "SN", pole: "S" },
  { id: 13, text: "I like to imagine how things could be, rather than how they are.", dimension: "SN", pole: "N" },
  { id: 14, text: "I pay close attention to the details in front of me.", dimension: "SN", pole: "S" },
  { id: 15, text: "I am drawn to abstract and creative ideas.", dimension: "SN", pole: "N" },

  { id: 16, text: "I make decisions based on logic rather than feelings.", dimension: "TF", pole: "T" },
  { id: 17, text: "I care a lot about how my decisions affect other people.", dimension: "TF", pole: "F" },
  { id: 18, text: "I value fairness more than harmony.", dimension: "TF", pole: "T" },
  { id: 19, text: "I find it easy to understand other people's emotions.", dimension: "TF", pole: "F" },
  { id: 20, text: "I prefer to be honest even if it might hurt someone.", dimension: "TF", pole: "T" },
  { id: 21, text: "I often put others' needs before my own.", dimension: "TF", pole: "F" },
  { id: 22, text: "I stay calm and objective when solving problems.", dimension: "TF", pole: "T" },
  { id: 23, text: "I am sensitive to the moods of people around me.", dimension: "TF", pole: "F" },

  { id: 24, text: "I like to plan things well in advance.", dimension: "JP", pole: "J" },
  { id: 25, text: "I prefer to keep my options open rather than commit early.", dimension: "JP", pole: "P" },
  { id: 26, text: "I feel satisfied when I finish tasks ahead of time.", dimension: "JP", pole: "J" },
  { id: 27, text: "I enjoy being spontaneous and flexible.", dimension: "JP", pole: "P" },
  { id: 28, text: "I like to have a clear schedule for my day.", dimension: "JP", pole: "J" },
  { id: 29, text: "I often leave things until the last minute.", dimension: "JP", pole: "P" },
  { id: 30, text: "I prefer a structured and organised lifestyle.", dimension: "JP", pole: "J" },
];

module.exports = questions;
