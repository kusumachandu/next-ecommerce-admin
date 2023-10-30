import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


//update route

export async function PATCH(
  req: Request,
  { params }: {params: {storeId: string, billboardId: string}}
) {
  try {
    const {userId} = auth();
    const body = await req.json();

    const { label, imageUrl } = body;

    if(!userId) {
      return new NextResponse('UnAuthenticated', { status: 401 });
    }

    if(!label) {
      return new NextResponse('Label is required', { status: 400 });
    }

    if(!imageUrl) {
      return new NextResponse('Image URL is required', { status: 400 });
    }

    if(!params.billboardId) {
      return new NextResponse('Billboard id is required', { status: 400 });
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

    const billboard = await prismadb.billboard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl
      }
    })

    return NextResponse.json(billboard);

  } catch(error) {
    console.log('[BILLBOARD_PATCH]', error)
    return new NextResponse('internal error', { status: 500  })
  }
}

//get route for single billboard

export async function GET(
  req: Request,
  {params}: {params: { billboardId: string}}
) {
  try {
    const {userId} = auth();

    if(!params.billboardId) {
      return new NextResponse('Billboard id is required', { status: 400 });
    }

    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: params.billboardId
      }
    })

    console.log(billboard);

    return NextResponse.json(billboard);

  } catch(error) {
    console.log('[BILLBOARD_GET]', error)
    return new NextResponse('internal error', { status: 500  })
  }
}


// delete route

export async function DELETE(
  req: Request,
  {params}: {params: {storeId: string, billboardId: string}}
) {
  try {
    const {userId} = auth();

    if(!userId) {
      return new NextResponse('UnAuthorized', { status: 401 });
    }

    if(!params.billboardId) {
      return new NextResponse('Billboard id is required', { status: 400 });
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

    const billboard = await prismadb.billboard.deleteMany({
      where: {
        id: params.billboardId
      }
    })

    console.log(billboard);

    return NextResponse.json(billboard);

  } catch(error) {
    console.log('[BILLBOARD_DELETE]', error)
    return new NextResponse('internal error', { status: 500  })
  }
}