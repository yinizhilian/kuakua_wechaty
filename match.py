from collections import Counter
import json
import random
import sys
import io
#数组中随机选择出来一个数字
def randomText(textArr):
	length = len(textArr)
	if length < 1:
		return '可以告诉我嘛？你为什么这么可爱~~'
	if length == 1:
		return str(textArr[0])
	randomNumber = random.randint(0,length-1)
	return str(textArr[randomNumber])

#Cosine相似度计算
def similarity(w_str1, w_str2):
    # word-lists to compare
    a = w_str1
    # print('a:',a)
    b = w_str2
    # print('b:',b)
    # count word occurrences
    a_vals = Counter(a)
    # print('a_vals',a_vals)
    b_vals = Counter(b)

    # convert to word-vectors
    words  = list(a_vals.keys() | b_vals.keys())
    a_vect = [a_vals.get(word, 0) for word in words]        # [0, 0, 1, 1, 2, 1]
    b_vect = [b_vals.get(word, 0) for word in words]        # [1, 1, 1, 0, 1, 0]

    # find cosine
    len_a  = sum(av*av for av in a_vect) ** 0.5             # sqrt(7)
    len_b  = sum(bv*bv for bv in b_vect) ** 0.5             # sqrt(4)
    dot    = sum(av*bv for av,bv in zip(a_vect, b_vect))    # 3
    cosine = dot / (len_a * len_b)                          # 0.5669467
    # print(cosine)
    return cosine

def answer_match(str_in):
    result_dict=dict()
    #读取json数据到内存中
    File=open('./data/kuakua_pxj_origin06.json','r',encoding='utf-8')
    json_data=json.load(File)
    json_length=len(json_data['kuakua'])
    # print('json_data_length:\n',json_length)

    for index in range(json_length):
        # result_dict[json_data['kuakua'][index]['question']+'---'+str(index)]=similarity(str_in,json_data['kuakua'][index]['question'])
        result_dict[index]=similarity(str_in,json_data['kuakua'][index]['question'])
    result_dict_end=sorted(result_dict.items(),key=lambda x: x[1],reverse=True)
    result_index=result_dict_end[0:1][0][0]
    result_answer=randomText(json_data['kuakua'][result_index]['answer'])
    return result_answer

if __name__ == "__main__":
    #输入时符号方面的问题还没有解决
    str_in=sys.argv[1]
    result=answer_match(str_in)
    # sys.stdout=io.TextIOWrapper(sys.stdout.detach(),encoding='utf-8')
    print(result) 