export interface Role {
  title: string;
  purpose: string;
}

export interface Task {
  id: string;
  description: string;
  role: string;
  agent: string;
  deps: string[];
}

export interface Persona {
  agent: string;
  role: string;
  system_prompt: string;
}

export interface PlaybookTeam {
  notes: string;
  prompts: Persona[];
}

export interface Protocol {
  description: string;
  [key: string]: any;
}

export interface PlaybookData {
  high_level_goal: string;
  reasoning: string;
  roles: Role[];
  tasks: Task[];
  team: PlaybookTeam;
  communication_protocols: Protocol;
  operational_cycle_management: Protocol;
  system_monitoring: Protocol;
  meta_communication_guidelines: Protocol;
  ethical_guidelines: Protocol;
  response_guidelines: Protocol;
  collaboration_guidelines: Protocol;
  placeholder_guidelines: Protocol;
  natural_language_to_formal_translation_guidelines: Protocol;
  dynamic_role_adaptation_guidelines: Protocol;
  joint_decision_making_guidelines: Protocol;
  integrity_and_security_guidelines: Protocol;
  plan_generation_guidelines: Protocol;
  holistic_approach_guidelines: Protocol;
  [key: string]: any;
}
