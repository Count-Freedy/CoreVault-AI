export const BADGES_DATA = [
  { id: "scholar", name: "Market Scholar", iconName: "Brain", requiredXP: 500 },
  { id: "alpha", name: "Alpha Verify", iconName: "Award", requiredXP: 1000 },
  { id: "executor", name: "Flawless Execution", iconName: "Zap", requiredXP: 1500 },
  { id: "navigator", name: "Risk Navigator", iconName: "Compass", requiredXP: 2000 },
  { id: "whale", name: "Whale Hunter", iconName: "TrendingUp", requiredXP: 3000 },
];

export const COURSES_DATA = [
  { 
    id: 1, 
    title: "Algorithmic Trading Automation", 
    level: "Masterclass", 
    duration: "12 Modules", 
    xp: 500, 
    color: "from-blue-500/20 to-transparent",
    modules: 12,
    content: "Algorithmic trading uses rigid rule-based logic to execute financial transactions at speeds impossible for humans. By employing Python, PineScript, or MQL, traders can tap directly into exchange APIs. This course covers state machines, API rate limiting, handling slippage, and correctly writing WebSocket listen keys to digest raw order book liquidity without latency drops."
  },
  { 
    id: 2, 
    title: "On-Chain Crypto Analytics", 
    level: "Advanced", 
    duration: "8 Modules", 
    xp: 350, 
    color: "from-purple-500/20 to-transparent",
    modules: 8,
    content: "Unlike traditional finance, the blockchain is a massive, publicly legible ledger. On-Chain analytics involves scraping memory pools (mempool), tracking whale wallet addresses, and identifying token distributions. You will learn to use tools like Glassnode and Nansen algorithms to detect sudden spikes in Exchange Inflows, which historically act as heavily correlated leading indicators of market crashes."
  },
  { 
    id: 3, 
    title: "Yield Farming Optimization", 
    level: "Expert", 
    duration: "15 Modules", 
    xp: 800, 
    color: "from-emerald-500/20 to-transparent",
    modules: 15,
    content: "Yield farming in Decentralized Finance (DeFi) allows investors to act as liquidity providers. However, Impermanent Loss is the silent killer here. This module explores how to mathematically hedge Liquidity Pool (LP) exposure using directional short positions on Aave/Compound, allowing you to harvest high APY block rewards without suffering downside asset depreciation."
  },
  { 
    id: 4, 
    title: "Options Flow & Dark Pools", 
    level: "Advanced", 
    duration: "10 Modules", 
    xp: 450, 
    color: "from-orange-500/20 to-transparent",
    modules: 10,
    content: "Institutional block trades frequently happen off-exchange inside 'Dark Pools' to prevent massive spread slippage. However, their hedging footprints appear in Options Orderflow. You will master reading the 'Tape', identifying delayed dark pool prints, and interpreting Gamma Exposure (GEX) walls to determine where Market Makers are forced to dynamically hedge underlying stocks."
  },
];

export const QUIZ_BANK = [
  { q: "What is the primary function of a decentralized exchange (DEX) Automated Market Maker (AMM)?", options: ["Executing limit orders directly", "Matching buyers to sellers instantly", "Using liquidity pools to calculate price via a mathematical curve", "Connecting directly to bank feeds"], correct: 2 },
  { q: "What does 'Slippage' refer to in trading?", options: ["A margin call triggered by brokers", "The difference between expected price and execution price", "A sudden drop in stock valuation", "When a stop-loss is ignored entirely"], correct: 1 },
  { q: "In options trading, what does 'Gamma' measure?", options: ["The rate of change in Delta over price", "Time decay of the contract", "Implied volatility fluctuations", "The bid-ask spread width"], correct: 0 },
  { q: "What is 'Impermanent Loss' in DeFi?", options: ["Losing your private keys temporarily", "Hacked smart contracts", "Opportunity cost when holding tokens in an LP vs just holding them", "Losing staking rewards fully"], correct: 2 },
  { q: "What does a 'Dark Pool' allow institutional traders to do?", options: ["Avoid paying SEC taxes", "Trade massive block sizes without immediately moving the public markets", "Trade cryptocurrencies completely anonymously", "Bypass all margin requirements"], correct: 1 },
  { q: "Which metric tracks the amount of capital locked in DeFi protocols?", options: ["APY", "TVL (Total Value Locked)", "FDV", "DCA"], correct: 1 },
  { q: "What does 'Short Squeeze' mean?", options: ["When long buyers panic sell", "When shorters are forced to buy back shares simultaneously, causing price spikes", "A metric for bond yields", "When hedge funds stop trading altogether"], correct: 1 },
  { q: "What is a Smart Contract?", options: ["A legal LLC framework on chain", "A self-executing code script deployed on a blockchain", "An AI trading bot", "A multi-signature hardware wallet"], correct: 1 },
  { q: "What is the primary benefit of a 'Trailing Stop-Loss'?", options: ["Guarantees a 100% win rate", "Automatically moves the limit up as the stock price rises to lock in profits", "Prevents hackers from selling", "It executes pre-market only"], correct: 1 },
  { q: "In crypto, what is an MEV bot?", options: ["Miner Extractable Value bot that front-runs transactions", "Market Evaluation Volume index", "Multiple Exchange Verification", "Maximum Earnings Validator"], correct: 0 },
  { q: "What does 'RSI' (Relative Strength Index) primarily measure?", options: ["Market news sentiment analysis", "The speed and change of price movements bounded 0-100", "Total trading volume per hour", "Moving average convergence"], correct: 1 },
  { q: "What is 'Beta' in stock markets?", options: ["The final testing phase of a company", "A measure of a stock's volatility relative to the overall market", "The dividend payout ratio", "A company's total debt balance"], correct: 1 },
  { q: "What is 'Support' and 'Resistance'?", options: ["Levels where price historically bounces up or struggles to break through", "Federal reserve interest rate brackets", "The bid vs the ask", "Volume density at opening bell"], correct: 0 },
  { q: "What happens during a 'Bitcoin Halving'?", options: ["Current Bitcoin prices are halved", "Miners block rewards are cut in half", "Transaction speeds are doubled", "Half of the supply is burned"], correct: 1 },
  { q: "What does 'Quantitative Easing' (QE) usually do to markets?", options: ["Injects liquidity and generally inflates asset prices", "Causes immediate deflation", "Stops all algorithmic trading", "Increass taxes on gains"], correct: 0 },
  { q: "What is 'Arbitrage'?", options: ["Borrowing shares to short sell", "Buying and selling the identical asset on two markets to profit from price differences", "Using AI to predict trends", "Holding assets long term"], correct: 1 },
  { q: "What distinguishes a 'Market Order' from a 'Limit Order'?", options: ["Market orders expire in 24h", "Market orders execute immediately at best available price, Limit orders execute only at a specific price", "Market orders are cheaper", "Limit orders are only for institutions"], correct: 1 },
  { q: "What is the 'VIX'?", options: ["A tech stock index", "A volatility index representing market expectation of 30-day forward-looking volatility", "A virtual exchange server", "Value In Execution average"], correct: 1 },
  { q: "What does 'Fully Diluted Valuation' (FDV) represent in crypto?", options: ["Current market cap", "Market cap if the max supply was in circulation", "The total fiat burned", "Daily trading volume"], correct: 1 },
  { q: "What is the function of 'Stop-Limit' orders?", options: ["It stops all trading for the day", "It triggers a limit order once a specific stop price is crossed", "It blocks high-frequency traders", "It acts as a market order with infinite slippage parameters"], correct: 1 },
  { q: "What are 'Bollinger Bands' used for?", options: ["Identifying overbought and oversold conditions based on standard deviations", "Tracking dark pool volumes", "Predicting exact interest rates", "Analyzing CEO performance"], correct: 0 },
  { q: "What does 'Liquidity' refer to?", options: ["How liquid a company's cash assets are", "How easily an asset can be converted to cash without affecting its market price", "The speed of a blockchain", "The total volume traded exactly at 4:00 PM"], correct: 1 },
  { q: "In Proof of Stake (PoS), what is 'Slashing'?", options: ["Cutting transaction fees heavily", "A penalty where a validator loses a portion of their staked tokens for malicious behavior", "A method to compress block size", "The act of reducing token supply permanently"], correct: 1 },
  { q: "What does a 'Death Cross' indicate on a chart?", options: ["The end of a trading session", "When a short-term moving average crosses below a long-term moving average", "A company filing for bankruptcy", "When options expire worthless"], correct: 1 },
  { q: "What is a 'Margin Call'?", options: ["A broker demanding an investor deposit additional money to cover potential losses", "A phone call from the SEC", "A strategy to buy calls using margin", "When a trade executes instantly"], correct: 0 }
];
