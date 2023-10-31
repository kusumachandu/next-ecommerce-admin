import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


//update route

export async function PATCH(
  req: Request,
  { params }: {params: {storeId: string, productId: string}}
) {
  try {
    const {userId} = auth();
    const body = await req.json();

    const { 
      name,
      price,
      categoryId,
      sizeId,
      colorId,
      images,
      isFeatured,
      isArchived
     } = body;

    if(!userId) {
      return new NextResponse('UnAuthenticated', { status: 401 });
    }

    if(!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    if(!price) {
      return new NextResponse('Price is required', { status: 400 });
    }

    if(!categoryId) {
      return new NextResponse('category id is required', { status: 400 });
    }

    if(!sizeId) {
      return new NextResponse('size id is required', { status: 400 });
    }

    if(!colorId) {
      return new NextResponse('color id is required', { status: 400 });
    }

    if(!images || !images.length) {
      return new NextResponse('images are required', { status: 400 });
    }

    if(!params.productId) {
      return new NextResponse('Product id is required', { status: 400 });
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

    await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        images: {
          deleteMany: {}
        },
        isFeatured,
        isArchived
      }
    })

    const product = await prismadb.product.update({
      where: {
        id: params.productId
      },
      data: {
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image)
            ]
          }
        }
      }
    })

    return NextResponse.json(product);

  } catch(error) {
    console.log('[PRODUCT_PATCH]', error)
    return new NextResponse('internal error', { status: 500  })
  }
}

//get route for single product

export async function GET(
  req: Request,
  {params}: {params: { productId: string}}
) {
  try {
    const {userId} = auth();

    if(!params.productId) {
      return new NextResponse('Product id is required', { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true
      }
    })

    console.log(product);

    return NextResponse.json(product);

  } catch(error) {
    console.log('[PRODUCT_GET]', error)
    return new NextResponse('internal error', { status: 500  })
  }
}


// delete route

export async function DELETE(
  req: Request,
  {params}: {params: {storeId: string, productId: string}}
) {
  try {
    const {userId} = auth();

    if(!userId) {
      return new NextResponse('UnAuthorized', { status: 401 });
    }

    if(!params.productId) {
      return new NextResponse('product id is required', { status: 400 });
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

    const product = await prismadb.product.deleteMany({
      where: {
        id: params.productId
      }
    })

    console.log(product);

    return NextResponse.json(product);

  } catch(error) {
    console.log('[PRODUCT_DELETE]', error)
    return new NextResponse('internal error', { status: 500  })
  }
}