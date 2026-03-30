"""
汉字识别后端服务 - 百度OCR API
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import json
import requests
import os

app = Flask(__name__)
CORS(app)

# 百度OCR配置
API_KEY = 'K7DZ1moQFIp7lzanUFfHpV8P'
SECRET_KEY = '5fqL2xugKedjwWcFzsqNWaexGkwr6PH3'

# 获取百度OCR Access Token
def get_access_token():
    """获取百度OCR access_token"""
    auth_url = 'https://aip.baidubce.com/oauth/2.0/token'
    params = {
        'grant_type': 'client_credentials',
        'client_id': API_KEY,
        'client_secret': SECRET_KEY
    }
    
    try:
        response = requests.post(auth_url, params=params, timeout=10)
        result = response.json()
        return result.get('access_token')
    except Exception as e:
        print(f"获取access_token失败: {e}")
        return None

# 缓存access_token
_access_token = None

@app.route('/api/ocr', methods=['POST'])
def recognize_handwriting():
    """识别手写汉字 - 使用百度OCR API"""
    global _access_token
    
    try:
        data = request.get_json()
        image_data = data.get('image', '')
        
        if not image_data:
            return jsonify({'success': False, 'error': 'No image data'})
        
        # 移除data:image前缀
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        # 获取access_token（带缓存）
        if not _access_token:
            _access_token = get_access_token()
            if not _access_token:
                return jsonify({'success': False, 'error': '百度API认证失败'})
        
        # 调用百度手写文字识别API
        url = f'https://aip.baidubce.com/rest/2.0/ocr/v1/handwriting?access_token={_access_token}'
        
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        
        data = {
            'image': image_data
        }
        
        response = requests.post(url, headers=headers, data=data, timeout=30)
        result = response.json()
        
        # 检查是否有错误
        if 'error_code' in result:
            # 如果是token过期，尝试重新获取
            if result.get('error_code') in [110, 111]:  # access_token过期或无效
                _access_token = get_access_token()
                if _access_token:
                    # 重试一次
                    url = f'https://aip.baidubce.com/rest/2.0/ocr/v1/handwriting?access_token={_access_token}'
                    response = requests.post(url, headers=headers, data=data, timeout=30)
                    result = response.json()
        
        # 解析结果
        if 'words_result' in result and result['words_result']:
            words = result['words_result']
            if isinstance(words, list) and len(words) > 0:
                # 取第一个识别结果
                first_word = words[0].get('words', '')
                if first_word:
                    # 提取汉字
                    import re
                    chars = re.findall(r'[\u4e00-\u9fff]', first_word)
                    if chars:
                        return jsonify({
                            'success': True,
                            'text': ''.join(chars[:3]),  # 最多返回3个汉字
                            'raw': first_word
                        })
            
            # 如果是字典格式
            if isinstance(words, dict):
                for key, value in words.items():
                    text = value.get('words', '')
                    if text:
                        import re
                        chars = re.findall(r'[\u4e00-\u9fff]', text)
                        if chars:
                            return jsonify({
                                'success': True,
                                'text': ''.join(chars[:3]),
                                'raw': text
                            })
        
        return jsonify({
            'success': False,
            'error': '未识别到汉字，请书写更清晰'
        })
            
    except requests.exceptions.Timeout:
        return jsonify({'success': False, 'error': '识别超时，请重试'})
    except Exception as e:
        print(f"OCR识别错误: {e}")
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'provider': 'baidu-ocr'})

if __name__ == '__main__':
    print("=" * 50)
    print("  汉字识别服务 - 百度OCR API")
    print("  访问地址: http://localhost:5000")
    print("=" * 50)
    
    # 预先测试连接
    token = get_access_token()
    if token:
        print("  ✅ 百度OCR API 连接成功")
    else:
        print("  ❌ 百度OCR API 连接失败")
    
    app.run(host='0.0.0.0', port=5000, debug=True)