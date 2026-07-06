import Replicate from 'replicate';
import { NextRequest, NextResponse } from 'next/server';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: NextRequest) {
  try {
    const { image, scale } = await request.json();
    
    if (!image) {
      return NextResponse.json({ error: 'Missing image data' }, { status: 400 });
    }

    // Use Clarity Upscaler (popular, reliable AI upscaler)
    const input = {
      image: image,
      scale_factor: scale || 2
    };
    
    const output = await replicate.run("philz1337x/clarity-upscaler", { input });

    // Get the output URL (output is an array, take first element)
    let outputUrl: string;
    if (Array.isArray(output) && output.length > 0) {
      outputUrl = output[0];
    } else if (typeof output === 'string') {
      outputUrl = output;
    } else if (output && typeof output === 'object' && 'url' in output && typeof output.url === 'function') {
      outputUrl = output.url();
    } else {
      throw new Error('Invalid Replicate output format');
    }

    return NextResponse.json({ output: outputUrl });
  } catch (error) {
    console.error('Replicate API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upscale image' },
      { status: 500 }
    );
  }
}
