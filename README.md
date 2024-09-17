这个 Cloudflare Worker 脚本提供了文本转语音（TTS）服务和获取可用语音列表的功能。以下是该 worker 的功能介绍、请求格式使用说明以及如何在 Cloudflare Workers 上部署该脚本。

### 功能介绍

1. **文本转语音（TTS）服务**
   - 将给定的文本转换为指定的语音格式。
   - 支持自定义语音类型、速率、音高和输出格式。
   
2. **获取可用语音列表**
   - 返回所有支持的语音选项。
   - 可以根据语音的语言和格式进行过滤。

### 使用方法和请求格式

#### 1. 文本转语音

- **URL**： `/tts`
- **请求方法**：GET
- **参数**：
  - `t` (optional)：要转换的文本。
  - `v` (optional)：语音类型的标识符，默认为 "zh-CN-XiaoxiaoMultilingualNeural"。
  - `r` (optional)：语速，默认值为 0。
  - `p` (optional)：音高，默认值为 0。
  - `o` (optional)：输出格式，默认为 "audio-24khz-48kbitrate-mono-mp3"。
  - `d` (optional)：是否下载结果音频文件，默认为 `false`。

**示例请求**：

```http
GET /tts?t=hello%2C%20world&v=zh-CN-XiaoxiaoMultilingualNeural&r=0&p=0&o=audio-24khz-48kbitrate-mono-mp3 HTTP/1.1
Host: your-worker.your-domain.workers.dev
x-api-key: your-key
```

#### 2. 获取可用语音列表

- **URL**： `/voices`
- **请求方法**：GET
- **参数**：
  - `l` (optional)：过滤语音的语言代码（如 `zh`, `zh-CN`）。
  - `f` (optional)：返回格式，0 表示 TTS-Server 格式，1 表示 MultiTTS 格式，默认为空。

**示例请求**：

```http
GET /voices?l=zh&f=1 HTTP/1.1
Host: your-worker.your-domain.workers.dev
x-api-key: your-key
```

### 跨域资源共享 (CORS)

所有响应都包含 CORS 头，通过以下头部实现：

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,HEAD,POST,OPTIONS
Access-Control-Allow-Headers: Content-Type, x-api-key
Access-Control-Max-Age: 86400
```

### 部署

1. **设置环境变量**：
   - 在 Cloudflare Workers 控制面板的“设置”中，添加环境变量 `API_KEY` 并将其值设置为 `your-key`。

2. **上传脚本**：
   - 在 Cloudflare Workers 控制面板中创建一个新的 Worker。
   - 将上述脚本粘贴到 Worker 编辑器中并保存。

3. **绑定域名（可选）**：
   - 将 Worker 绑定到一个自定义域名或子域名，以便于访问。

这样，你就可以在 Cloudflare Workers 上部署并运行这个文本转语音服务了。


参考项目：https://github.com/zuoban/tts
