import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


//update route

export async function PATCH(
  req: Request,
  { params }: {params: {storeId: string}}
) {
  try {
    const {userId} = auth();
    const body = await req.json();

    const { name } = body;

    if(!userId) {
      return new NextResponse('UnAuthorized', { status: 401 });
    }

    if(!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    if(!params.storeId) {
      return new NextResponse('store id is required', { status: 400 });
    }

    const store = await prismadb.store.updateMany({
      where: {
        id: params.storeId,
        userId
      },
      data: {
        name
      }
    })

    return NextResponse.json(store);

  } catch(error) {
    console.log('[STORE_PATCH]', error)
    return new NextResponse('internal error', { status: 500  })
  }
}


// delete route

export async function DELETE(
  req: Request,
  {params}: {params: {storeId: string}}
) {

  console.log(params);
  try {
    const {userId} = auth();

    if(!userId) {
      return new NextResponse('UnAuthorized', { status: 401 });
    }

    if(!params.storeId) {
      return new NextResponse('store id is required', { status: 400 });
    }

    console.log('before delete function')

    const store = await prismadb.store.deleteMany({
      where: {
        id: params.storeId,
        userId
      }
    })

    console.log(store);

    return NextResponse.json(store);

  } catch(error) {
    console.log('[STORE_DELETE]', error)
    return new NextResponse('internal error', { status: 500  })
  }
}