import Replicate, { FileOutput } from 'replicate';
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
    
    const output = await replicate.run("philz1337x/clarity-upscaler:dfad41707589d68ecdccd1dfa600d55a208f9310748e44bfe35b4a6291453d5e", { input });
    const file = (output as FileOutput[])[0];
    const url = file.url();

    return NextResponse.json({ output: url });
  } catch (error) {
    console.error('Replicate API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upscale image' },
      { status: 500 }
    );
  }
}
