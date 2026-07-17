import fs from "node:fs";
import path from "node:path";

const file = path.resolve("site", "data", "seminars.json");
const data = JSON.parse(fs.readFileSync(file, "utf8"));

const rules = [
  ["World Models", /world model|dreamer|daydreamer|genie/i],
  ["Reinforcement Learning", /reinforcement|reward|actor.?critic|soft actor|\bsac\b|ddpg|td3|policy.?based|정책 기반|강화\s?학습|intrinsic control|dreamer/i],
  ["Sim2Real", /sim.?2.?real|domain randomization|gen2sim/i],
  ["Synthetic Data", /simulation dataset|synthetic data|gen2sim|scaling up robot learning in simulation/i],
  ["Robotics", /robot|\bros\b|autonomous|자율주행|saycan|affordance|painting 로봇/i],
  ["Computer Vision", /computer vision|vision transformer|segmentation|image understanding|imagebind|opencv|\bcnn\b|segment anything|\bsam\b|선검출|용접선|시각장애인|radiometric|thermal camera|산불 면적|객체인지|color model/i],
  ["Optimization", /optim|meta.?heuristic|automl|최적|최적조합|job.?shop|scheduling|resource allocation|airline|llambo/i],
  ["Surrogate Modeling", /surrogate|deep surrogate|\bdsm\b/i],
  ["Foundation Models", /foundation model|large language|\bllm|imagebind|segment anything|\bsam\b|vision transformer|layoutlm|tree of thoughts|knowledge distillation/i],
  ["Generative AI", /diffusion|\bgan\b|generative model|large language|\bllm|tree of thoughts/i],
  ["Localization", /localization|positioning|\brtls\b|\buwb\b|tdoa|multilateration|\bslam\b/i],
  ["Control", /model reference adaptive control|\bmrac\b|\bpi\b|control method|제어/i],
  ["Multimodal AI", /multi.?modal|imagebind|\bvqa\b|data fusion|sensor fusion|thermal camera|layoutlm/i],
  ["Scientific Machine Learning", /pde.?refiner|neural pde|pde solver/i],
  ["Sequence Modeling", /mamba|sequence modeling|state spaces|transformer.?based surrogate/i],
  ["Resource Allocation", /resource allocation/i],
  ["Scheduling", /job.?shop|scheduling/i],
  ["Deep Learning", /deep learning|machine learning|neural network|transformer|\bcnn\b|layoutlm|panoptic segmentation/i],
  ["Extended Reality", /\bunity\b|\bvr\b|\bar\b|cinemachine|lightmap|raycast/i],
  ["Digital Twin", /digital twin|디지털트윈/i],
  ["Physical AI", /physical robot|robot learning/i],
];

const reviewedOverrides = new Map([
  ["Function Approximation in Reinforcement Learning", ["Reinforcement Learning"]],
  ["PDE-Refiner: Achieving Accurate Long Rollouts with Neural PDE Solvers", ["Scientific Machine Learning"]],
  ["Introduction to Reinforcement Learning", ["Reinforcement Learning"]],
  ["Do As I Can, Not As I Say: Grounding Language in Robotic Affordances(saycan)", ["Robotics", "Foundation Models"]],
  ["Transformer-Based Surrogate Model", ["Surrogate Modeling", "Sequence Modeling"]],
  ["Robot Foundation Model 2", ["Robotics", "Foundation Models", "Physical AI"]],
  ["Robot Foundation Model", ["Robotics", "Foundation Models", "Physical AI"]],
  ["GAN", ["Generative AI"]],
  ["Surrogate Model", ["Surrogate Modeling"]],
  ["Actor-Critic Deep Reinforcement Learning for Solving Job Shop Scheduling Problems", ["Reinforcement Learning", "Optimization", "Scheduling"]],
  ["Gen2Sim: Scaling up Robot Learning in Simulation with Generative Models", ["Sim2Real", "Synthetic Data", "Robotics", "Generative AI"]],
  ["InfographicVQA & 시각장애인 보행보조 시스템", ["Computer Vision", "Multimodal AI"]],
  ["DeepLSD", ["Computer Vision", "Deep Learning"]],
  ["머신러닝과 딥러닝", ["Deep Learning"]],
  ["Lidar Sensor and SLAM algorithm", ["Localization", "Robotics"]],
]);

for (const seminar of data.seminars) {
  const source = `${seminar.title} ${seminar.summary}`;
  seminar.keywords = rules.filter(([, pattern]) => pattern.test(source)).map(([keyword]) => keyword).slice(0, 4);
  if (reviewedOverrides.has(seminar.title)) seminar.keywords = reviewedOverrides.get(seminar.title);
  if (!seminar.keywords.length) seminar.keywords = ["Deep Learning"];
}

fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
console.log(`Added reviewed keyword candidates to ${data.seminars.length} seminars.`);
