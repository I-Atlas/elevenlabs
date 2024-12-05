export const createPresetId = (voice: {
  name: string;
  publicUserId: string;
  publicVoiceId: string;
}) => {
  return `${voice.name}|${voice.publicUserId}|${voice.publicVoiceId}`;
};
