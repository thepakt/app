export const UserData = {
  id: 1,
  username: "@Peter_0555",
  prettyName: "Peter Johnson",
  bio: "Full-stack developer | Web3 enthusiast | Coffe addict",
  avatarUrl: "",
  tasksCompleted: 47,

  reputation: 98,

  todos: [
    {
      type: "task_completed",
      title: "Implemented smart contract for decentralized voting system",
      description: "Implemented smart contract for decentralized voting system",
      date: "2023-06-15",
      bounty: 500,
    },
    {
      type: "task_started",
      title: "Building responsive UI for DeFi dashboard",
      description: "Building responsive UI for DeFi dashboard",
      date: "2023-06-10",
      bounty: 300,
    },
  ],
  socialLinks: {
    github: "https://github.com/peter-johnson",
    twitter: "https://twitter.com/peter_dev",
    telegram: "wtf",
  },
}

export type UserDataType = typeof UserData
