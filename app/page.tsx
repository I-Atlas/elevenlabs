import TextToSpeech from "./components/text-to-speech";

export default function Home() {
  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Text to Speech using ElevenLabs API
        </h1>
        <div className="flex justify-center">
          Choose between ElevenLab&#39;s many voices, and listen to the pristine
          generated audio:
        </div>
        <TextToSpeech />
      </div>
    </main>
  );
}
