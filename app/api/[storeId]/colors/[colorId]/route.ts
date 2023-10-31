import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


//update route

export async function PATCH(
  req: Request,
  { params }: {params: {storeId: string, colorId: string}}
) {
  try {
    const {userId} = auth();
    const body = await req.json();

    const { name, value } = body;

    if(!userId) {
      return new NextResponse('UnAuthenticated', { status: 401 });
    }

    if(!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    if(!value) {
      return new NextResponse('Value is required', { status: 400 });
    }

    if(!params.colorId) {
      return new NextResponse('Color id is required', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    }) 

    if(!storeByUserId) {
      return new NextResponse('Unauthorised', {status: 403});
    }

    const color = await prismadb.color.updateMany({
      where: {
        id: params.colorId,
      },
      data: {
        name,
        value
      }
    })

    return NextResponse.json(color);

  } catch(error) {
    console.log('[COLOR_PATCH]', error)
    return new NextResponse('internal error', { status: 500  })
  }
}

//get route for single Color

export async function GET(
  req: Request,
  {params}: {params: { colorId: string}}
) {
  try {
    const {userId} = auth();

    if(!params.colorId) {
      return new NextResponse('Color id is required', { status: 400 });
    }

    const color = await prismadb.color.findUnique({
      where: {
        id: params.colorId
      }
    })

    console.log(color);

    return NextResponse.json(color);

  } catch(error) {
    console.log('[COLOR_GET]', error)
    return new NextResponse('internal error', { status: 500  })
  }
}


// delete route

export async function DELETE(
  req: Request,
  {params}: {params: {storeId: string, colorId: string}}
) {
  try {
    const {userId} = auth();

    if(!userId) {
      return new NextResponse('UnAuthorized', { status: 401 });
    }

    if(!params.colorId) {
      return new NextResponse('Color id is required', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    }) 

    if(!storeByUserId) {
      return new NextResponse('Unauthorised', {status: 403});
    }

    const color = await prismadb.color.deleteMany({
      where: {
        id: params.colorId
      }
    })

    console.log(color);

    return NextResponse.json(color);

  } catch(error) {
    console.log('[COLOR_DELETE]', error)
    return new NextResponse('internal error', { status: 500  })
  }
}