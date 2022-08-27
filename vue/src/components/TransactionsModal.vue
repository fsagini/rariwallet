<!-- eslint-disable prettier/prettier -->
<template>
  <div>
    <div class="image__blur__filters" @click="handleModalClose()" />
    <div class="modal__filters">
      <div class="flex items-center justify-between px-4 font-bold text-xl">
        <span>Transaction type</span>
        <span
          @click="
            changePageView({
              optionSelect: optionSelect,
            })
          "
          class="text-[#347AF0] cursor-pointer"
          >Search</span
        >
      </div>
      <div class="mt-4 mb-4">
        <span
          @click="handleModalClose()"
          class="canecel_filter bg-[#F1F5FB] rounded-md text-[#347AF0] font-bold cursor-pointer shadow-md text-lg"
          >Done</span
        >
      </div>
      <span class="py-4 text-gray-500 text-lg">select and search</span>
      <div
        v-for="category in transactionCateogory"
        :key="category.type"
        class="flex items-center space-x-4 px-4 mt-2"
      >
        <div class="category__filter rounded-full bg-[#F1F4FB]">
          <i :class="category.icon" />
        </div>
        <div class="flex-1 font-bold text-lg">{{ category.type }}</div>
        <div>
          <input
            type="radio"
            name="radioSelection"
            :value="category.type"
            :id="category.type"
            v-model="optionSelect"
            style="height: 25px; width: 25px; vertical-align: middle"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<!-- eslint-disable prettier/prettier -->
<script lang="ts">
import { mixins } from "vue-class-component";
import { Emit, Prop, Watch } from "vue-property-decorator";
import { Authenticated } from "../mixins/mixins";
export default class TransactionsModal extends mixins(Authenticated) {
  optionSelect: any;
  transactionCateogory: any = [
    { type: "Deposited", icon: "fa-solid fa-circle-arrow-up" },
    { type: "Sent", icon: "fa-solid fa-circle-right" },
    { type: "Withdrawn", icon: "fa-solid fa-circle-arrow-down" },
  ];
  @Prop()
  isModalOpen: boolean;
  @Prop()
  pageView: any;
  @Emit("changePageView")
  changePageView(selected: any) {
    if (selected) {
      selected.optionSelect = this.optionSelect;
      window.console.log(this.optionSelect);
    }
  }
  @Emit("handleModalClose")
  handleModalClose() {
    this.isModalOpen = !this.isModalOpen;
  }

  @Watch("optionSelect")
  onOptionSelectChange(newValue: string) {
    if (newValue) {
      this.optionSelect = newValue;
      return this.pageView;
    }
  }
}
</script>
<!-- eslint-disable prettier/prettier -->
<style scoped>
.image__blur__filters {
  position: absolute;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.75);
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
}
.canecel_filter {
  padding: 10px 30px;
}

.modal__filters {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  background-color: white;
  padding: 1rem;
  text-align: center;
  width: 357px;
  height: 42.5%;
  position: fixed;
  top: 42vh;
  z-index: 2;
}
@media (max-width: 480px) {
  .modal__filters {
    width: 345px;
    height: 42.5%;
    top: 29.5vh;
  }
}
</style>
