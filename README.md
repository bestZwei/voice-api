# TTS API 服务

此项目部署在 Cloudflare Workers 上，提供文本到语音 (Text to Speech, TTS) 和语音列表功能，并通过设置 API 密钥进行保护。

## 功能概述

1. **文本到语音（TTS）**：将输入的文本转换为语音并返回音频文件。
2. **语音列表**：提供可用的语音列表，供用户选择。

## 请求限制

所有请求必须包含有效的 API 密钥。API 密钥需要通过 `x-api-key` 请求头提供。

## 环境变量

确保在 Cloudflare Workers 环境中配置以下变量：

- `API_KEY`: 用于验证请求的 API 密钥。例如：`test`

## 使用方法

### 1. 获取文本到语音的音频文件

**请求方法**：`GET`

**请求路径**：`/tts`

**请求参数**：

- `t`：需要转换的文本（必填）。
- `v`：语音名称，默认为 `zh-CN-XiaoxiaoMultilingualNeural`。
- `r`：语速，默认为 0。
- `p`：音调，默认为 0。
- `o`：输出格式，默认为 `audio-24khz-48kbitrate-mono-mp3`。
- `d`：是否下载文件，默认为 `false`。

**请求示例**：

```
GET https://yourdomain.org/tts?t=你好世界&v=zh-CN-XiaoxiaoMultilingualNeural&r=0&p=0&o=audio-24khz-48kbitrate-mono-mp3
x-api-key: test
```

**响应**：

- 成功时返回生成的语音音频文件。
- 失败时返回错误信息和相应的 HTTP 状态码。

### 2. 获取可用语音列表

**请求方法**：`GET`

**请求路径**：`/voices`

**请求参数**：

- `l`：语言（可选），例如 `zh` 或 `zh-CN`。
- `f`：返回格式，`0` 为 TTS-Server 格式，`1` 为 MultiTTS 格式，默认为 JSON 格式。

**请求示例**：

```
GET https://yourdomain.org/voices?l=zh&f=1
x-api-key: test
```

**响应**：

- 返回可用的语音列表。

## 示例请求

### 使用 `curl` 发送请求

```sh
curl -X GET "https://yourdomain.org/tts?t=你好世界&v=zh-CN-XiaoxiaoMultilingualNeural&r=0&p=0&o=audio-24khz-48kbitrate-mono-mp3" \
     -H "x-api-key: test"
```

### 使用浏览器控制台发送请求

打开浏览器开发者工具 (F12)，在 Console 选项卡中运行以下代码：

```javascript
fetch('https://yourdomain.org/tts?t=你好世界&v=zh-CN-XiaoxiaoMultilingualNeural&r=0&p=0&o=audio-24khz-48kbitrate-mono-mp3', {
    method: 'GET',
    headers: {
        'x-api-key': 'test'
    }
})
.then(response => {
    if(!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.blob();
})
.then(blob => {
    // 处理返回的音频数据
    const url = window.URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play();

    // 如果您想下载音频文件，可以取消注释以下代码
    // const a = document.createElement('a');
    // a.style.display = 'none';
    // document.body.appendChild(a);
    // a.href = url;
    // a.download = 'voice.mp3';
    // a.click();
    // window.URL.revokeObjectURL(url);
})
.catch(error => console.error('There was a problem with your fetch operation:', error));
```

## 常见问题

### 常见错误和解决方法

1. **401 Unauthorized**：检查 `x-api-key` 的值是否正确。
2. **404 Not Found**：检查请求路径和参数是否正确。
3. **其他错误**：检查控制台中的错误日志，确保请求格式和参数正确。

通过上述说明，您可以成功使用这个 TTS API 服务。如果有任何问题，请查阅代码注释或联系相关技术支持。



参考项目：https://github.com/zuoban/tts
