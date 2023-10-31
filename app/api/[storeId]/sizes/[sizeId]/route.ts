import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


//update route

export async function PATCH(
  req: Request,
  { params }: {params: {storeId: string, sizeId: string}}
) {
  try {
    const {userId} = auth();
    const body = await req.json();

    const { name, value } = body;

    if(!userId) {
      return new NextResponse('UnAuthenticated', { status: 401 });
    }

    if(!name) {
      return new NextResponse('Label is required', { status: 400 });
    }

    if(!value) {
      return new NextResponse('Image URL is required', { status: 400 });
    }

    if(!params.sizeId) {
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

    const size = await prismadb.size.updateMany({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
        value
      }
    })

    return NextResponse.json(size);

  } catch(error) {
    console.log('[SIZE_PATCH]', error)
    return new NextResponse('internal error', { status: 500  })
  }
}

//get route for single billboard

export async function GET(
  req: Request,
  {params}: {params: { sizeId: string}}
) {
  try {
    const {userId} = auth();

    if(!params.sizeId) {
      return new NextResponse('Size id is required', { status: 400 });
    }

    const size = await prismadb.size.findUnique({
      where: {
        id: params.sizeId
      }
    })

    console.log(size);

    return NextResponse.json(size);

  } catch(error) {
    console.log('[SIZE_GET]', error)
    return new NextResponse('internal error', { status: 500  })
  }
}


// delete route

export async function DELETE(
  req: Request,
  {params}: {params: {storeId: string, sizeId: string}}
) {
  try {
    const {userId} = auth();

    if(!userId) {
      return new NextResponse('UnAuthorized', { status: 401 });
    }

    if(!params.sizeId) {
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

    const size = await prismadb.size.deleteMany({
      where: {
        id: params.sizeId
      }
    })

    console.log(size);

    return NextResponse.json(size);

  } catch(error) {
    console.log('[SIZE_DELETE]', error)
    return new NextResponse('internal error', { status: 500  })
  }
}