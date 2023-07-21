// Import necessary libraries
import { Configuration, OpenAIApi } from "openai";
import { exec } from 'child_process';
import fs from 'fs';
import { NextResponse } from "next/server";

// Promisify the exec function from child_process
const util = require('util');
const execAsync = util.promisify(exec);
// Configure the OpenAI API client
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
// This function handles POST requests to the /api/speechToText route
export async function POST(request) {
  // Check if the OpenAI API key is configured
  if (!configuration.apiKey) {
    return NextResponse.json({ error: "OpenAI API key not configured, please follow instructions in README.md" }, {status:500});
  }
  // Parse the request body
  const req = await request.json()

  // Extract the audio data from the request body
  const base64Audio = req.audio;
  // Convert the Base64 audio data back to a Buffer
  const audio = Buffer.from(base64Audio, 'base64');

  try {
    // Convert the audio data to text
    const text = await convertAudioToText(audio);
    // Return the transcribed text in the response
    return NextResponse.json({result: text}, {status:200});
  } catch(error) {
    // Handle any errors that occur during the request
    if (error.response) {
      console.error(error.response.status, error.response.data);
      return NextResponse.json({ error: error.response.data }, {status:500});
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      return NextResponse.json({ error: "An error occurred during your request." }, {status:500});
    }
  }
}
// This function converts audio data to text using the OpenAI API
async function convertAudioToText(audioData) {
  // Convert the audio data to MP3 format
  const mp3AudioData = await convertAudioToMp3(audioData);
  console.log("MP3", mp3AudioData)
  // Write the MP3 audio data to a file
  const outputPath = '/tmp/output.mp3';
  fs.writeFileSync(outputPath, mp3AudioData);
  // Transcribe the audio
  const response = await openai.createTranscription(
      fs.createReadStream(outputPath),
      'whisper-1'
  );
  // // Delete the temporary file
  fs.unlinkSync(outputPath);
  // // The API response contains the transcribed text
  const transcribedText = response.data.text;
  return transcribedText;
}
// This function converts audio data to MP3 format using ffmpeg
async function convertAudioToMp3(audioData) {
  // Write the audio data to a file
  const inputPath = '/tmp/input.webm';
  fs.writeFileSync(inputPath, audioData);
  // Convert the audio to MP3 using ffmpeg
  const outputPath = '/tmp/output.mp3';
  await execAsync(`ffmpeg -i ${inputPath} ${outputPath}`);
  // Read the converted audio data
  const mp3AudioData = fs.readFileSync(outputPath);
  // Delete the temporary files
  fs.unlinkSync(inputPath);
  fs.unlinkSync(outputPath);
  return mp3AudioData;
}

// import fs from 'fs'
// import { IncomingForm } from 'formidable';
// import { Readable } from 'stream';
// import { Configuration, OpenAIApi } from "openai";

// const configuration = new Configuration({
//   organization: "org-YsQ8EqcnKoKRetafEWwEC2uI",
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

// export async function POST(req) {
//   // console.log("REQUEST", req.body)
//   const form = new IncomingForm();
//   form.parse(req, async (err, fields, files) => {
//     if (err) {
//       console.log('ERROR', err.message)
//       res.status(500).json({ error: err.message });
//       return;
//     }
//     const { mimeType } = fields;
//     const filePath = files.audio[0].filepath
//     // console.log('FILES 0', files.audio[0])
//     const audioBuffer = await fs.promises.readFile(filePath);
//     // console.log("AUDIO BUGGER", audioBuffer)
//     // Rest of your code...
//     try {
//       // console.log('STREAAM', audioBuffer)
//       const audioExt = mimeType === "audio/webm" ? "mp3" : "mp4" 
//       const audioReadStream = Readable.from(audioBuffer)
//       audioReadStream.path = `conversation.${audioExt}`;
//       const transcription = await transcribeWhisper(audioReadStream)
//       res.status(200).json({ speechText: transcription });
//     } catch (e) {
//       console.error('Error:', e.message);
//       res.status(500).json({ error: e.message });
//     }
//   });
// };

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// }

// const transcribeWhisper = async (file) => {
//   try {  
//     const transcript = await openai.createTranscription(
//     file,
//     "whisper-1",
//   )
//   return transcript.data.text;
// } catch (e) {
//     console.log('ERROR',e.message)
//   }
// }



// import { Configuration, OpenAIApi } from "openai";
// import { NextResponse } from "next/server";
// import { Readable } from 'stream'
// import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
// import fs from 'fs';
// import path from 'path';

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(configuration);

// export async function POST(req) {
//   if (!configuration.apiKey) {
//     return NextResponse.json({
//       error: {
//         message:
//           "OpenAI API key not configured, please follow instructions in README.md",
//       },
//     });
//   }

//   try {
//     const formData = await req.formData();
//     const blob = formData.get("file");
//     const model = formData.get("model");
//     const temp = formData.get("temperature");
//     const lang = formData.get("language");
//     const prompt = formData.get("prompt");

//     const mp3Buffer = await convertToMP3(blob);

//     // const buffer = Buffer.from(await blob.arrayBuffer());

//     // const filename =
//     //   "file" + Date.now() + Math.round(Math.random() * 100000) + ".m4a";
//     // const filepath = `${path.join("public", "uploads", filename)}`;

//     // fs.writeFileSync(filepath, buffer);

//     // file = fs.createReadStream(filepath)

//     // createTranscription(file, model, prompt, responseFormat, temperature, language, options = {})

//     console.log("STUFF", mp3Buffer, model, temp, lang, prompt)

//     const transcription = await openai.createTranscription(
//       mp3Buffer,
//       model,
//       temp,
//       lang,
//       prompt,
//     );
//     console.log("TRANSCRIPT", transcription)

//     return NextResponse.json({
//       result: transcription.data,
//     });
//   } catch (error) {
//     return NextResponse.json({
//       error: {
//         message: "An error occurred during your request.",
//       },
//     });
//   }
// }

// async function convertToMP3(audioBlob) {
//   const ffmpeg = createFFmpeg({ log: true });

//   // Load the FFmpeg library
//   await ffmpeg.load();

//   // Write the audio blob to a temporary input file
//   const inputFilePath = path.join(process.cwd(), 'temp', 'input.wav');
//   await fs.promises.mkdir(path.join(process.cwd(), 'temp'), { recursive: true });
//   await fs.promises.writeFile(inputFilePath, audioBlob);

//   // Convert the audio using FFmpeg
//   const outputFilePath = path.join(process.cwd(), 'temp', 'output.mp3');
//   await ffmpeg.run('-i', '/input.wav', '-c:a', 'libmp3lame', '/output.mp3', {
//     input: '/input.wav',
//     output: '/output.mp3',
//   });

//   // Read the converted .mp3 file into a buffer
//   const mp3Buffer = await fs.promises.readFile(outputFilePath);

//   // Clean up temporary files
//   await fs.promises.unlink(inputFilePath);
//   await fs.promises.unlink(outputFilePath);

//   return mp3Buffer;
// }
