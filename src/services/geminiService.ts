import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY as string });

// Celebify Services
export const generateCelebrityName = async (gender: 'male' | 'female'): Promise<string> => {
  try {
    const prompt = `Name a random, globally famous ${gender} celebrity from any field, such as acting, music, comedy, politics, or sports. Provide only the full name. Ensure the choice is varied and not always the most obvious person.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            temperature: 1,
        }
    });
    
    const celebrityName = response.text.trim();

    if (!celebrityName) {
        throw new Error("API did not return a celebrity name.");
    }

    // A simple check to ensure it's not a long sentence, making the output more predictable.
    if (celebrityName.split(' ').length > 4) {
      console.warn(`Received a long name from API: ${celebrityName}. Using it anyway.`);
    }

    return celebrityName;
  } catch (error) {
    console.error("Error generating celebrity name:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate celebrity name: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating a celebrity name.");
  }
};

export const addCelebrityToImage = async (
  base64ImageData: string,
  mimeType: string,
  celebrityName: string
): Promise<{ newImageBase64: string | null; text: string | null }> => {
  try {
    const prompt = `In this image, add the celebrity ${celebrityName} interacting with the person(s). It is crucial that you do not change the original person(s) in any way—their appearance, pose, and position must remain exactly the same. Make the addition look as realistic as possible. For example, have the celebrity putting an arm around a shoulder, laughing, or talking with the person. Avoid generating handshakes. The celebrity should be blended seamlessly into the photo's lighting and style.`;

    const imagePart = {
      inlineData: {
        data: base64ImageData,
        mimeType: mimeType,
      },
    };

    const textPart = {
      text: prompt,
    };

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [imagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });
    
    let newImageBase64: string | null = null;
    let text: string | null = null;
    
    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                newImageBase64 = part.inlineData.data;
            } else if (part.text) {
                text = part.text;
            }
        }
    }
    
    if (!newImageBase64) {
        throw new Error("API did not return an image.");
    }

    return { newImageBase64, text };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the image.");
  }
};

// CharacterFuse Services
export const transformImage = async (
  base64ImageData: string,
  mimeType: string,
  characterName: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: `ABSOLUTE RULE: DO NOT CHANGE THE PERSON'S FACE OR THE BACKGROUND. The face—including all features, expression, and skin tone—and the entire background must be 100% identical to the original image. Your ONLY task is to change the subject's clothing, hair, and any accessories to transform them into a realistic, live-action version of '${characterName}'. The final image should look like a photorealistic costume change, nothing more.`,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
        temperature: 0.3,
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    
    throw new Error("API did not return an image. It might be due to a safety policy violation.");

  } catch (error) {
    console.error("Error transforming image:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to transform image: ${error.message}`);
    }
    throw new Error("An unknown error occurred during image transformation.");
  }
};

// PokéFusion Services
export const getRandomPokemonName = async (pokedexNumber: number): Promise<string> => {
    if (!import.meta.env.VITE_API_KEY) {
        throw new Error("VITE_API_KEY environment variable is not set.");
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `What is the name of the Pokémon with National Pokédex number ${pokedexNumber}? Respond with only the name of the Pokémon. Do not add any other text or punctuation.`,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Gemini API call for random Pokémon failed:", error);
        throw new Error("Failed to get random Pokémon name from Gemini API.");
    }
};

export const editImageWithPokemon = async (base64ImageData: string, mimeType: string, pokemonName: string, pokemonStyle: string): Promise<GenerateContentResponse> => {
  if (!import.meta.env.VITE_API_KEY) {
    throw new Error("VITE_API_KEY environment variable is not set.");
  }

  let prompt: string;

  if (pokemonStyle === 'Realistic / Live-Action') {
    prompt = `Integrate a photorealistic, hyper-realistic ${pokemonName} into this image as if it were a still from a high-budget, live-action movie. The Pokémon must have realistic textures (fur, scales, skin, etc.) and be perfectly blended with the scene's lighting, casting accurate shadows and receiving reflections from the environment. It must interact believably and directly with any people or key subjects in the photo. Avoid a '3D model' or 'toy-like' appearance. The final result should be seamless and indistinguishable from a real photograph with a live-action creature.`;
  } else {
    prompt = `Add a ${pokemonName} to this image in a ${pokemonStyle} style. The Pokémon must blend seamlessly with the environment, matching the lighting, shadows, and overall artistic style of the image. It is crucial that the Pokémon interacts directly and naturally with any people or subjects in the photo (e.g., playing, battling, resting nearby). The Pokémon should not look like a sticker; it must be a fully integrated part of the scene.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    return response;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to generate image with Gemini API. Please check your API key and network connection.");
  }
};
