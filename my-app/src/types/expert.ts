export interface Expert {
  id: number;
  name: string;
  avatar: string;
  description: string;
}

export const defaultExperts: Expert[] = [
  {
    id: 1,
    name: 'Joe Rogan',
    avatar: 'https://i.pravatar.cc/100',
    description:
      'Humorous and engaging, covering a wide range of topics with a mix of crudeness and wisdom',
  },
  {
    id: 2,
    name: 'Andrew Huberman',
    avatar: 'https://i.pravatar.cc/100',
    description: 'Neuroscientist with deep theoretical knowledge',
  },
  {
    id: 3,
    name: 'Lex Fridman',
    avatar: 'https://i.pravatar.cc/100',
    description: 'Computer scientist, skilled in discussing technology and philosophy',
  },
  {
    id: 4,
    name: 'David Goggins',
    avatar: 'https://i.pravatar.cc/100',
    description: 'Ultra-endurance athlete and motivational speaker',
  },
  {
    id: 5,
    name: 'Jordan Peterson',
    avatar: 'https://i.pravatar.cc/100',
    description: 'Clinical psychologist and philosophical thinker',
  },
  {
    id: 6,
    name: 'Tim Ferriss',
    avatar: 'https://i.pravatar.cc/100',
    description: 'Author and podcast host focusing on self-improvement',
  },
  {
    id: 7,
    name: 'Naval Ravikant',
    avatar: 'https://i.pravatar.cc/100',
    description: 'Entrepreneur and philosophical thinker',
  },
];
