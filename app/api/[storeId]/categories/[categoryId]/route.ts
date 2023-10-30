import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


//update route

export async function PATCH(
  req: Request,
  { params }: {params: {storeId: string, categoryId: string}}
) {
  try {
    const {userId} = auth();
    const body = await req.json();

    const { name, billboardId } = body;

    if(!userId) {
      return new NextResponse('UnAuthenticated', { status: 401 });
    }

    if(!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    if(!billboardId) {
      return new NextResponse('Billboard Id is required', { status: 400 });
    }

    if(!params.categoryId) {
      return new NextResponse('category id is required', { status: 400 });
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

    const category = await prismadb.category.updateMany({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        billboardId
      }
    })

    return NextResponse.json(category);

  } catch(error) {
    console.log('[CATEGORY_PATCH]', error)
    return new NextResponse('internal error', { status: 500  })
  }
}

//get route for single billboard

export async function GET(
  req: Request,
  {params}: {params: { categoryId: string}}
) {
  try {
    const {userId} = auth();

    if(!params.categoryId) {
      return new NextResponse('Category id is required', { status: 400 });
    }

    const category = await prismadb.category.findUnique({
      where: {
        id: params.categoryId
      }
    })

    console.log(category);

    return NextResponse.json(category);

  } catch(error) {
    console.log('[CATEGORY_GET]', error)
    return new NextResponse('internal error', { status: 500  })
  }
}


// delete route

export async function DELETE(
  req: Request,
  {params}: {params: {storeId: string, categoryId: string}}
) {
  try {
    const {userId} = auth();

    if(!userId) {
      return new NextResponse('UnAuthorized', { status: 401 });
    }

    if(!params.categoryId) {
      return new NextResponse('Category id is required', { status: 400 });
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

    const category = await prismadb.category.deleteMany({
      where: {
        id: params.categoryId
      }
    })

    console.log(category);

    return NextResponse.json(category);

  } catch(error) {
    console.log('[CATEGORY_DELETE]', error)
    return new NextResponse('internal error', { status: 500  })
  }
}