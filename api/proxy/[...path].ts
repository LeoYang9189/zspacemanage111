import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return handleRequest(request, 'GET')
}

export async function POST(request: NextRequest) {
  return handleRequest(request, 'POST')
}

export async function PUT(request: NextRequest) {
  return handleRequest(request, 'PUT')
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request, 'DELETE')
}

export async function PATCH(request: NextRequest) {
  return handleRequest(request, 'PATCH')
}

async function handleRequest(request: NextRequest, method: string) {
  const url = new URL(request.url)
  const apiPath = url.pathname.replace('/api/proxy', '')
  const targetUrl = `http://8.149.244.70:8080${apiPath}${url.search}`

  try {
    const headers: Record<string, string> = {}
    
    // 复制请求头
    request.headers.forEach((value, key) => {
      if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
        headers[key] = value
      }
    })

    const options: RequestInit = {
      method,
      headers,
    }

    // 对于有body的请求，添加body
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      const body = await request.text()
      if (body) {
        options.body = body
      }
    }

    const response = await fetch(targetUrl, options)
    
    // 获取响应的Content-Type
    const contentType = response.headers.get('Content-Type') || 'application/json'
    
    // 根据Content-Type处理响应数据
    let data: string | ArrayBuffer
    if (contentType.includes('application/json')) {
      data = await response.text()
    } else {
      // 对于非JSON数据（如图片），使用ArrayBuffer
      data = await response.arrayBuffer()
    }

    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, backend-token',
        'Cache-Control': response.headers.get('Cache-Control') || 'no-cache',
      },
    })
  } catch (error) {
    console.error('Proxy error:', error)
    return new NextResponse(JSON.stringify({ error: 'Proxy request failed' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }
}