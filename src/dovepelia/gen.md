---
aside: false
---
<script setup>
import Train from "../../components/train/TrainZigen.vue"
import {high} from "../high.ts"
</script>

# 白鸠声母练习
切换到数字键盘

<Train zigenFont = "oppo-sans" name = "dovepelia-shengmu" zigenJson = "/dovepelia/shengmu.json" :high />

---

# 白鸠特殊韵母练习
这些韵母的介调没有和调归并，所以需要特别练习。

切换到数字键盘

<Train zigenFont = "oppo-sans" name = "dovepelia-yunmu" zigenJson = "/dovepelia/yunmu_special.json" :high />

---

# 白鸠全带调韵母练习
切换到数字键盘

<Train zigenFont = "oppo-sans" name = "dovepelia-yunmu" zigenJson = "/dovepelia/yunmu.json" :high />
