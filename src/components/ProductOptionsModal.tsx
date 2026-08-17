import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import {
  FoodItem,
  FoodOptionGroup,
  SelectedFoodOption
} from '../types';

interface ProductOptionsModalProps {
  isOpen: boolean;
  item: FoodItem | null;
  onClose: () => void;
  onAddToCart: (
    item: FoodItem,
    selectedOptions: SelectedFoodOption[],
    unitPrice: number,
    quantity: number
  ) => void;
}

export default function ProductOptionsModal({
  isOpen,
  item,
  onClose,
  onAddToCart
}: ProductOptionsModalProps) {
  const [selectedOptions, setSelectedOptions] =
    React.useState<SelectedFoodOption[]>([]);

  const [quantity, setQuantity] = React.useState(1);

  /*
   * Reset the modal whenever a new food item is opened.
   */
  React.useEffect(() => {
    if (isOpen && item) {
      setSelectedOptions([]);
      setQuantity(1);
    }
  }, [isOpen, item]);

  /*
   * Calculate the price of all selected options.
   */
  const optionsTotal = selectedOptions.reduce(
    (total, option) => total + option.price,
    0
  );

  /*
   * Base item price + customization prices.
   */
  const unitPrice = item
    ? item.price + optionsTotal
    : 0;

  /*
   * Total price including quantity.
   */
  const totalPrice = unitPrice * quantity;

  /*
   * Check whether all required option groups
   * have been completed.
   */
  const requiredGroupsComplete = item?.options
    ? item.options
        .filter((group) => group.required)
        .every((group) =>
          selectedOptions.some(
            (option) => option.groupId === group.id
          )
        )
    : true;

  /*
   * Handle selecting a radio option.
   */
  const handleRadioChange = (
    group: FoodOptionGroup,
    choiceId: string
  ) => {
    const choice = group.choices.find(
      (option) => option.id === choiceId
    );

    if (!choice) return;

    setSelectedOptions((current) => {
      const withoutGroup = current.filter(
        (option) => option.groupId !== group.id
      );

      return [
        ...withoutGroup,
        {
          groupId: group.id,
          groupName: group.name,
          choiceId: choice.id,
          choiceName: choice.name,
          price: choice.price
        }
      ];
    });
  };

  /*
   * Handle checkbox add-ons.
   */
  const handleCheckboxChange = (
    group: FoodOptionGroup,
    choiceId: string
  ) => {
    const choice = group.choices.find(
      (option) => option.id === choiceId
    );

    if (!choice) return;

    setSelectedOptions((current) => {
      const exists = current.some(
        (option) =>
          option.groupId === group.id &&
          option.choiceId === choice.id
      );

      if (exists) {
        return current.filter(
          (option) =>
            !(
              option.groupId === group.id &&
              option.choiceId === choice.id
            )
        );
      }

      return [
        ...current,
        {
          groupId: group.id,
          groupName: group.name,
          choiceId: choice.id,
          choiceName: choice.name,
          price: choice.price
        }
      ];
    });
  };

  /*
   * Add customized item to cart.
   */
  const handleAddToCart = () => {
    if (!item) return;

    if (!requiredGroupsComplete) {
      return;
    }

    onAddToCart(
      item,
      selectedOptions,
      unitPrice,
      quantity
    );

    onClose();
  };

  /*
   * Check whether a checkbox is selected.
   */
  const isCheckboxSelected = (
    groupId: string,
    choiceId: string
  ) => {
    return selectedOptions.some(
      (option) =>
        option.groupId === groupId &&
        option.choiceId === choiceId
    );
  };

  /*
   * Check whether a radio option is selected.
   */
  const isRadioSelected = (
    groupId: string,
    choiceId: string
  ) => {
    return selectedOptions.some(
      (option) =>
        option.groupId === groupId &&
        option.choiceId === choiceId
    );
  };

  return (
    <AnimatePresence>
      {isOpen && item && (
        <>
          {/* Background overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-[60]"
          />

          {/* Modal */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 20
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.96,
              y: 20
            }}
            transition={{
              duration: 0.2
            }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg max-h-[90vh] bg-white dark:bg-neutral-950 rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-stone-200 dark:border-neutral-800">

              {/* =========================
                  HEADER
              ========================== */}
              <div className="relative p-5 border-b border-stone-200 dark:border-neutral-800">

                <div className="flex gap-4 items-center">

                  {/* Food Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-2xl object-cover flex-shrink-0"
                  />

                  {/* Header Text */}
                  <div className="flex-1 min-w-0">
                    <h2 className="font-black text-lg sm:text-xl text-stone-900 dark:text-white leading-tight">
                      Let's Make Your Order
                    </h2>

                    <p className="text-xs sm:text-sm text-stone-500 dark:text-neutral-400 mt-1">
                      Customize your {item.name} just the way you like it.
                    </p>
                  </div>

                  {/* Close Button */}
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-neutral-900 text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer flex-shrink-0"
                    aria-label="Close customization"
                  >
                    <X className="w-5 h-5" />
                  </button>

                </div>

              </div>

              {/* =========================
                  OPTIONS CONTENT
              ========================== */}
              <div className="flex-1 overflow-y-auto p-10 space-y-6">

                {/* Food Name + Base Price */}
                <div className="flex items-center justify-between gap-4">

                  <div>
                    <h3 className="font-black text-base text-stone-900 dark:text-white">
                      {item.name}
                    </h3>

                    {item.description && (
                      <p className="text-xs text-stone-500 dark:text-neutral-400 mt-1">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="font-black text-sm text-stone-900 dark:text-white whitespace-nowrap">
                    ₦{item.price.toLocaleString()}
                  </div>

                </div>

                {/* Dynamic Option Groups */}
                {item.options && item.options.length > 0 ? (
                  <div className="space-y-6">

                    {item.options.map((group) => (
                      <div
                        key={group.id}
                        className="space-y-3"
                      >

                        {/* Group Header */}
                        <div className="flex items-center justify-between">

                          <h3 className="font-black text-sm uppercase tracking-wide text-stone-900 dark:text-white">
                            {group.name}
                          </h3>

                          {group.required && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">
                              Required
                            </span>
                          )}

                        </div>

                        {/* =========================
                            RADIO OPTIONS
                            Displayed horizontally
                        ========================== */}
                        {group.type === 'radio' ? (
                          <div className="flex items-center gap-5 flex-wrap">

                            {group.choices.map((choice) => {
                              const selected = isRadioSelected(
                                group.id,
                                choice.id
                              );

                              return (
                                <label
                                  key={choice.id}
                                  className="flex items-center gap-2 cursor-pointer select-none"
                                >

                                  <input
                                    type="radio"
                                    name={`option-${group.id}`}
                                    value={choice.id}
                                    checked={selected}
                                    onChange={() =>
                                      handleRadioChange(
                                        group,
                                        choice.id
                                      )
                                    }
                                    className="w-4 h-4 accent-yellow-400 cursor-pointer"
                                  />

                                  <span className="text-sm font-semibold text-stone-800 dark:text-neutral-200">
                                    {choice.name}
                                  </span>

                                  {choice.price > 0 && (
                                    <span className="text-xs font-bold text-stone-500 dark:text-neutral-400">
                                      +₦{choice.price.toLocaleString()}
                                    </span>
                                  )}

                                </label>
                              );
                            })}

                          </div>
                        ) : (
                          /* =========================
                             CHECKBOX OPTIONS
                             Keep boxed design
                          ========================== */
                          <div className="space-y-2">

                            {group.choices.map((choice) => {
                              const selected =
                                isCheckboxSelected(
                                  group.id,
                                  choice.id
                                );

                              return (
                                <label
                                  key={choice.id}
                                  className={`flex items-center justify-between gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                                    selected
                                      ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-400/10'
                                      : 'border-stone-200 dark:border-neutral-800 bg-stone-50 dark:bg-neutral-900/50 hover:border-stone-300 dark:hover:border-neutral-700'
                                  }`}
                                >

                                  <div className="flex items-center gap-3">

                                    <input
                                      type="checkbox"
                                      value={choice.id}
                                      checked={selected}
                                      onChange={() =>
                                        handleCheckboxChange(
                                          group,
                                          choice.id
                                        )
                                      }
                                      className="w-4 h-4 accent-yellow-400 cursor-pointer"
                                    />

                                    <span className="text-sm font-semibold text-stone-800 dark:text-neutral-200">
                                      {choice.name}
                                    </span>

                                  </div>

                                  {choice.price > 0 && (
                                    <span className="text-xs font-bold text-stone-500 dark:text-neutral-400">
                                      +₦{choice.price.toLocaleString()}
                                    </span>
                                  )}

                                </label>
                              );
                            })}

                          </div>
                        )}

                      </div>
                    ))}

                  </div>
                ) : (
                  /* No Options */
                  <div className="py-8 text-center">

                    <div className="w-14 h-14 mx-auto rounded-full bg-yellow-100 dark:bg-yellow-400/10 flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-yellow-500" />
                    </div>

                    <h3 className="mt-3 font-black text-sm text-stone-900 dark:text-white">
                      No customization needed
                    </h3>

                    <p className="mt-1 text-xs text-stone-500 dark:text-neutral-400">
                      This item is ready to be added to your basket.
                    </p>

                  </div>
                )}

              </div>

              {/* =========================
                  FOOTER
              ========================== */}
              <div className="border-t border-stone-200 dark:border-neutral-800 p-5 bg-stone-50 dark:bg-neutral-900/60">

                {/* Quantity + Price */}
                <div className="flex items-center justify-between gap-4 mb-4">

                  {/* Quantity */}
                  <div className="flex items-center bg-white dark:bg-neutral-950 border border-stone-200 dark:border-neutral-800 rounded-xl px-1.5 py-1">

                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(
                          Math.max(1, quantity - 1)
                        )
                      }
                      className="p-2 text-stone-500 hover:text-stone-900 dark:hover:text-white cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <span className="min-w-[32px] text-center font-black text-sm text-stone-900 dark:text-white">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(quantity + 1)
                      }
                      className="p-2 text-stone-500 hover:text-stone-900 dark:hover:text-white cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                  </div>

                  {/* Total */}
                  <div className="text-right">

                    <p className="text-[10px] uppercase tracking-wider font-bold text-stone-500 dark:text-neutral-400">
                      Total
                    </p>

                    <p className="text-xl font-black text-stone-900 dark:text-white">
                      ₦{totalPrice.toLocaleString()}
                    </p>

                  </div>

                </div>

                {/* Required Options Warning */}
                {!requiredGroupsComplete && (
                  <p className="text-xs font-bold text-red-500 text-center mb-3">
                    Please select all required options before adding to your basket.
                  </p>
                )}

                {/* Add To Cart */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!requiredGroupsComplete}
                  className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
                    requiredGroupsComplete
                      ? 'bg-yellow-400 hover:bg-yellow-500 text-neutral-900 cursor-pointer shadow-lg shadow-yellow-400/10'
                      : 'bg-stone-200 dark:bg-neutral-800 text-stone-400 dark:text-neutral-600 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />

                  <span>
                    Add to Cart · ₦
                    {totalPrice.toLocaleString()}
                  </span>

                </button>

              </div>

            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}