import { useEffect, useMemo, useRef, useState } from 'react'

import { supabase } from '../../lib/supabase'

import { FOOD_ITEMS } from '../../data'

import {

  FoodOptionGroup,

  FoodOptionChoice,

  FoodOptionType,

} from '../../types'



type Product = {

  id: number

  name: string

  category: string

  price: number

  description: string | null

  image_url: string | null

  available: boolean

  rating: number | null

  prep_time: string | null

  is_featured: boolean | null

  options: FoodOptionGroup[] | null

  created_at: string

}



type ProductForm = {

  name: string

  category: string

  price: string

  description: string

  image_url: string

  available: boolean

  rating: string

  prep_time: string

  is_featured: boolean

  options: FoodOptionGroup[]

}



const emptyForm: ProductForm = {

  name: '',

  category: '',

  price: '',

  description: '',

  image_url: '',

  available: true,

  rating: '0',

  prep_time: '',

  is_featured: false,

  options: [],

}



export default function AdminProducts() {

  const [products, setProducts] = useState<Product[]>([])

  const [searchTerm, setSearchTerm] = useState('')

  const [loading, setLoading] = useState(true)

  const [errorMsg, setErrorMsg] = useState('')

  const [updatingId, setUpdatingId] = useState<number | null>(null)



  const [editingProduct, setEditingProduct] =

    useState<Product | null>(null)



  const [editForm, setEditForm] =

    useState<ProductForm>(emptyForm)



  const [editImageFile, setEditImageFile] =

    useState<File | null>(null)



  const [editImagePreview, setEditImagePreview] =

    useState<string>('')



  const [showAddModal, setShowAddModal] = useState(false)



  const [newProduct, setNewProduct] =

    useState<ProductForm>(emptyForm)



  const [newImageFile, setNewImageFile] =

    useState<File | null>(null)



  const [newImagePreview, setNewImagePreview] =

    useState<string>('')



  const [addingProduct, setAddingProduct] = useState(false)



  const editImageInputRef =

    useRef<HTMLInputElement | null>(null)



  const newImageInputRef =

    useRef<HTMLInputElement | null>(null)



  useEffect(() => {

    fetchProducts()

  }, [])



  const fetchProducts = async () => {

    setLoading(true)

    setErrorMsg('')



    const { data, error } = await supabase

      .from('products')

      .select('*')

      .order('created_at', { ascending: false })



    if (error) {

      console.error('ADMIN PRODUCTS ERROR:', error)

      setErrorMsg('Unable to load products.')

      setLoading(false)

      return

    }



    setProducts(data || [])

    setLoading(false)

  }

  const filteredProducts = useMemo(() => {

  const query = searchTerm.trim().toLowerCase()



  if (!query) return products



  return products.filter((product) =>

    [product.name, product.category].some((value) =>

      value?.toLowerCase().includes(query)

    )

  )

}, [products, searchTerm])



  // -----------------------------------------

  // IMPORT PRODUCTS

  // -----------------------------------------



  const importProducts = async () => {

    const productsToInsert = FOOD_ITEMS.map((item) => ({

      name: item.name,

      category: item.category,

      price: item.price,

      description: item.description || null,

      image_url: item.image || null,

      available: true,

      rating: Number(item.rating ?? 0),

      prep_time: item.prepTime || null,

      is_featured: item.isFeatured ?? false,

      options: item.options ?? [],

    }))



    const { error } = await supabase

      .from('products')

      .insert(productsToInsert)



    if (error) {

      console.error(

        'IMPORT PRODUCTS ERROR:',

        error

      )



      alert('Unable to import products.')

      return

    }



    alert('Products imported successfully!')



    fetchProducts()

  }



  // -----------------------------------------

  // AVAILABILITY

  // -----------------------------------------



  const toggleAvailability = async (

    product: Product

  ) => {

    setUpdatingId(product.id)



    const newAvailability = !product.available



    const { error } = await supabase

      .from('products')

      .update({

        available: newAvailability,

      })

      .eq('id', product.id)



    if (error) {

      console.error(

        'UPDATE AVAILABILITY ERROR:',

        error

      )



      alert(

        'Unable to update product availability.'

      )



      setUpdatingId(null)

      return

    }



    setProducts((currentProducts) =>

      currentProducts.map((item) =>

        item.id === product.id

          ? {

              ...item,

              available: newAvailability,

            }

          : item

      )

    )



    setUpdatingId(null)

  }



  // -----------------------------------------

  // IMAGE UPLOAD

  // -----------------------------------------



  const uploadProductImage = async (

    file: File

  ): Promise<string | null> => {

    if (!file.type.startsWith('image/')) {

      alert('Please select an image file.')

      return null

    }



    if (file.size > 5 * 1024 * 1024) {

      alert('Image must be smaller than 5MB.')

      return null

    }



    const fileExtension =

      file.name.split('.').pop()?.toLowerCase() ||

      'jpg'



    const fileName = `${crypto.randomUUID()}.${fileExtension}`



    const filePath = `products/${fileName}`



    const { error: uploadError } =

      await supabase.storage

        .from('product-images')

        .upload(filePath, file, {

          cacheControl: '3600',

          upsert: false,

        })



    if (uploadError) {

      console.error(

        'IMAGE UPLOAD ERROR:',

        uploadError

      )



      alert(

        `Image upload failed: ${uploadError.message}`

      )



      return null

    }



    const { data } =

      supabase.storage

        .from('product-images')

        .getPublicUrl(filePath)



    return data.publicUrl

  }



  // -----------------------------------------

  // DELETE IMAGE

  // -----------------------------------------



  const deleteProductImage = async (

    imageUrl: string | null

  ) => {

    if (!imageUrl) return



    if (

      !imageUrl.includes(

        '/storage/v1/object/public/product-images/'

      )

    ) {

      return

    }



    const marker =

      '/storage/v1/object/public/product-images/'



    const filePath = imageUrl.split(marker)[1]



    if (!filePath) return



    const { error } = await supabase.storage

      .from('product-images')

      .remove([filePath])



    if (error) {

      console.error(

        'DELETE IMAGE ERROR:',

        error

      )

    }

  }



  // -----------------------------------------

  // DELETE PRODUCT

  // -----------------------------------------



  const deleteProduct = async (

    product: Product

  ) => {

    const confirmed = window.confirm(

      `Are you sure you want to delete "${product.name}"? This action cannot be undone.`

    )



    if (!confirmed) return



    setUpdatingId(product.id)



    const { error } = await supabase

      .from('products')

      .delete()

      .eq('id', product.id)



    if (error) {

      console.error(

        'DELETE PRODUCT ERROR:',

        error

      )



      alert('Unable to delete product.')



      setUpdatingId(null)

      return

    }



    if (product.image_url) {

      await deleteProductImage(

        product.image_url

      )

    }



    setProducts((currentProducts) =>

      currentProducts.filter(

        (item) => item.id !== product.id

      )

    )



    setUpdatingId(null)



    alert('Product deleted successfully!')

  }



  // -----------------------------------------

  // EDIT PRODUCT

  // -----------------------------------------



  const openEditModal = (

    product: Product

  ) => {

    setEditingProduct(product)



    setEditForm({

      name: product.name,

      category: product.category,

      price: String(product.price),

      description:

        product.description || '',

      image_url:

        product.image_url || '',

      available: product.available,

      rating: String(product.rating ?? 0),

      prep_time: product.prep_time || '',

      is_featured:

        product.is_featured ?? false,

      options: Array.isArray(product.options)

        ? product.options

        : [],

    })



    setEditImageFile(null)

    setEditImagePreview(

      product.image_url || ''

    )

  }



  const closeEditModal = () => {

    setEditingProduct(null)

    setEditForm(emptyForm)

    setEditImageFile(null)

    setEditImagePreview('')



    if (editImageInputRef.current) {

      editImageInputRef.current.value = ''

    }

  }



  const handleEditImageChange = (

    e: React.ChangeEvent<HTMLInputElement>

  ) => {

    const file = e.target.files?.[0]



    if (!file) return



    if (!file.type.startsWith('image/')) {

      alert('Please select an image file.')

      return

    }



    if (file.size > 5 * 1024 * 1024) {

      alert('Image must be smaller than 5MB.')

      return

    }



    setEditImageFile(file)



    const previewUrl =

      URL.createObjectURL(file)



    setEditImagePreview(previewUrl)

  }



  const saveProduct = async () => {

    if (!editingProduct) return



    if (!editForm.name.trim()) {

      alert('Please enter a product name.')

      return

    }



    if (!editForm.category.trim()) {

      alert('Please enter a category.')

      return

    }



    if (

      !editForm.price ||

      Number(editForm.price) < 0

    ) {

      alert('Please enter a valid price.')

      return

    }



    const rating = Number(editForm.rating)



    if (

      Number.isNaN(rating) ||

      rating < 0 ||

      rating > 5

    ) {

      alert('Rating must be between 0 and 5.')

      return

    }



    setUpdatingId(editingProduct.id)



    let finalImageUrl =

      editForm.image_url



    // Upload new image if selected

    if (editImageFile) {

      const uploadedUrl =

        await uploadProductImage(

          editImageFile

        )



      if (!uploadedUrl) {

        setUpdatingId(null)

        return

      }



      finalImageUrl = uploadedUrl

    }



    const { data, error } = await supabase

      .from('products')

      .update({

        name: editForm.name.trim(),

        category: editForm.category.trim(),

        price: Number(editForm.price),

        description:

          editForm.description.trim() ||

          null,

        image_url:

          finalImageUrl || null,

        available:

          editForm.available,

        rating,

        prep_time:

          editForm.prep_time.trim() ||

          null,

        is_featured:

          editForm.is_featured,

        options:

          editForm.options,

      })

      .eq('id', editingProduct.id)

      .select()

      .single()



    if (error) {

      console.error(

        'UPDATE PRODUCT ERROR:',

        error

      )



      alert(

        `Unable to update product: ${error.message}`

      )



      setUpdatingId(null)

      return

    }



    // Delete old image after successful update

    if (

      editImageFile &&

      editingProduct.image_url &&

      editingProduct.image_url !==

        finalImageUrl

    ) {

      await deleteProductImage(

        editingProduct.image_url

      )

    }



    setProducts((currentProducts) =>

      currentProducts.map((product) =>

        product.id === editingProduct.id

          ? data

          : product

      )

    )



    setUpdatingId(null)



    closeEditModal()



    alert('Product updated successfully!')

  }



  // -----------------------------------------

  // ADD PRODUCT

  // -----------------------------------------



  const openAddModal = () => {

    setNewProduct({

      ...emptyForm,

      options: [],

    })



    setNewImageFile(null)

    setNewImagePreview('')

    setShowAddModal(true)

  }



  const closeAddModal = () => {

    setShowAddModal(false)

    setNewProduct(emptyForm)

    setNewImageFile(null)

    setNewImagePreview('')



    if (newImageInputRef.current) {

      newImageInputRef.current.value = ''

    }

  }



  const handleNewImageChange = (

    e: React.ChangeEvent<HTMLInputElement>

  ) => {

    const file = e.target.files?.[0]



    if (!file) return



    if (!file.type.startsWith('image/')) {

      alert('Please select an image file.')

      return

    }



    if (file.size > 5 * 1024 * 1024) {

      alert('Image must be smaller than 5MB.')

      return

    }



    setNewImageFile(file)



    const previewUrl =

      URL.createObjectURL(file)



    setNewImagePreview(previewUrl)

  }



  const addProduct = async () => {

    if (!newProduct.name.trim()) {

      alert('Please enter a product name.')

      return

    }



    if (!newProduct.category.trim()) {

      alert('Please enter a category.')

      return

    }



    if (

      !newProduct.price ||

      Number(newProduct.price) < 0

    ) {

      alert('Please enter a valid price.')

      return

    }



    const rating = Number(newProduct.rating)



    if (

      Number.isNaN(rating) ||

      rating < 0 ||

      rating > 5

    ) {

      alert('Rating must be between 0 and 5.')

      return

    }



    setAddingProduct(true)



    let imageUrl = ''



    // Upload image

    if (newImageFile) {

      const uploadedUrl =

        await uploadProductImage(

          newImageFile

        )



      if (!uploadedUrl) {

        setAddingProduct(false)

        return

      }



      imageUrl = uploadedUrl

    }



    const { data, error } = await supabase

      .from('products')

      .insert({

        name: newProduct.name.trim(),

        category:

          newProduct.category.trim(),

        price: Number(

          newProduct.price

        ),

        description:

          newProduct.description.trim() ||

          null,

        image_url:

          imageUrl || null,

        available:

          newProduct.available,

        rating,

        prep_time:

          newProduct.prep_time.trim() ||

          null,

        is_featured:

          newProduct.is_featured,

        options:

          newProduct.options,

      })

      .select()

      .single()



    if (error) {

      console.error(

        'ADD PRODUCT ERROR:',

        error

      )



      if (imageUrl) {

        await deleteProductImage(

          imageUrl

        )

      }



      alert(

        `Unable to add product: ${error.message}`

      )



      setAddingProduct(false)

      return

    }



    setProducts((currentProducts) => [

      data,

      ...currentProducts,

    ])



    setAddingProduct(false)



    closeAddModal()



    alert('Product added successfully!')

  }



  // -----------------------------------------

  // OPTION HELPERS

  // -----------------------------------------



  const addOptionGroup = (

    formType: 'edit' | 'new'

  ) => {

    const newGroup: FoodOptionGroup = {

      id: crypto.randomUUID(),

      name: 'New Option',

      type: 'radio',

      required: false,

      choices: [],

    }



    if (formType === 'edit') {

      setEditForm((current) => ({

        ...current,

        options: [

          ...current.options,

          newGroup,

        ],

      }))

    } else {

      setNewProduct((current) => ({

        ...current,

        options: [

          ...current.options,

          newGroup,

        ],

      }))

    }

  }



  const removeOptionGroup = (

    formType: 'edit' | 'new',

    groupIndex: number

  ) => {

    if (formType === 'edit') {

      setEditForm((current) => ({

        ...current,

        options: current.options.filter(

          (_, index) =>

            index !== groupIndex

        ),

      }))

    } else {

      setNewProduct((current) => ({

        ...current,

        options: current.options.filter(

          (_, index) =>

            index !== groupIndex

        ),

      }))

    }

  }



  const updateOptionGroup = (

    formType: 'edit' | 'new',

    groupIndex: number,

    changes: Partial<FoodOptionGroup>

  ) => {

    if (formType === 'edit') {

      setEditForm((current) => {

        const updatedOptions = [

          ...current.options,

        ]



        updatedOptions[groupIndex] = {

          ...updatedOptions[groupIndex],

          ...changes,

        }



        return {

          ...current,

          options: updatedOptions,

        }

      })

    } else {

      setNewProduct((current) => {

        const updatedOptions = [

          ...current.options,

        ]



        updatedOptions[groupIndex] = {

          ...updatedOptions[groupIndex],

          ...changes,

        }



        return {

          ...current,

          options: updatedOptions,

        }

      })

    }

  }



  const addOptionChoice = (

    formType: 'edit' | 'new',

    groupIndex: number

  ) => {

    const newChoice: FoodOptionChoice = {

      id: crypto.randomUUID(),

      name: 'New Choice',

      price: 0,

    }



    if (formType === 'edit') {

      setEditForm((current) => {

        const updatedOptions = [

          ...current.options,

        ]



        updatedOptions[groupIndex] = {

          ...updatedOptions[groupIndex],

          choices: [

            ...updatedOptions[groupIndex]

              .choices,

            newChoice,

          ],

        }



        return {

          ...current,

          options: updatedOptions,

        }

      })

    } else {

      setNewProduct((current) => {

        const updatedOptions = [

          ...current.options,

        ]



        updatedOptions[groupIndex] = {

          ...updatedOptions[groupIndex],

          choices: [

            ...updatedOptions[groupIndex]

              .choices,

            newChoice,

          ],

        }



        return {

          ...current,

          options: updatedOptions,

        }

      })

    }

  }



  const removeOptionChoice = (

    formType: 'edit' | 'new',

    groupIndex: number,

    choiceIndex: number

  ) => {

    if (formType === 'edit') {

      setEditForm((current) => {

        const updatedOptions = [

          ...current.options,

        ]



        updatedOptions[groupIndex] = {

          ...updatedOptions[groupIndex],

          choices:

            updatedOptions[

              groupIndex

            ].choices.filter(

              (_, index) =>

                index !== choiceIndex

            ),

        }



        return {

          ...current,

          options: updatedOptions,

        }

      })

    } else {

      setNewProduct((current) => {

        const updatedOptions = [

          ...current.options,

        ]



        updatedOptions[groupIndex] = {

          ...updatedOptions[groupIndex],

          choices:

            updatedOptions[

              groupIndex

            ].choices.filter(

              (_, index) =>

                index !== choiceIndex

            ),

        }



        return {

          ...current,

          options: updatedOptions,

        }

      })

    }

  }



  const updateOptionChoice = (

    formType: 'edit' | 'new',

    groupIndex: number,

    choiceIndex: number,

    changes: Partial<FoodOptionChoice>

  ) => {

    if (formType === 'edit') {

      setEditForm((current) => {

        const updatedOptions = [

          ...current.options,

        ]



        const updatedChoices = [

          ...updatedOptions[groupIndex]

            .choices,

        ]



        updatedChoices[choiceIndex] = {

          ...updatedChoices[choiceIndex],

          ...changes,

        }



        updatedOptions[groupIndex] = {

          ...updatedOptions[groupIndex],

          choices: updatedChoices,

        }



        return {

          ...current,

          options: updatedOptions,

        }

      })

    } else {

      setNewProduct((current) => {

        const updatedOptions = [

          ...current.options,

        ]



        const updatedChoices = [

          ...updatedOptions[groupIndex]

            .choices,

        ]



        updatedChoices[choiceIndex] = {

          ...updatedChoices[choiceIndex],

          ...changes,

        }



        updatedOptions[groupIndex] = {

          ...updatedOptions[groupIndex],

          choices: updatedChoices,

        }



        return {

          ...current,

          options: updatedOptions,

        }

      })

    }

  }



  // -----------------------------------------

  // OPTION EDITOR UI

  // -----------------------------------------



  const renderOptionsEditor = (

    formType: 'edit' | 'new'

  ) => {

    const options =

      formType === 'edit'

        ? editForm.options

        : newProduct.options



    return (

      <div className="border-t pt-5 mt-5">



        <div className="flex items-center justify-between mb-3">



          <div>

            <label className="block text-sm font-bold">

              Product Options

            </label>



            <p className="text-xs text-gray-500 mt-1">

              Add customization options customers can select.

            </p>

          </div>



          <button

            type="button"

            onClick={() =>

              addOptionGroup(formType)

            }

            className="px-3 py-2 rounded-lg bg-black text-white text-sm"

          >

            + Add Group

          </button>



        </div>



        <div className="space-y-5">



          {options.map(

            (group, groupIndex) => (



              <div

                key={group.id}

                className="border rounded-xl p-4 bg-gray-50"

              >



                <div className="flex justify-between gap-3 mb-4">



                  <input

                    type="text"

                    value={group.name}

                    onChange={(e) =>

                      updateOptionGroup(

                        formType,

                        groupIndex,

                        {

                          name: e.target.value,

                        }

                      )

                    }

                    className="flex-1 border rounded-lg px-3 py-2 bg-white"

                    placeholder="Option group name"

                  />



                  <button

                    type="button"

                    onClick={() =>

                      removeOptionGroup(

                        formType,

                        groupIndex

                      )

                    }

                    className="px-3 py-2 rounded-lg bg-red-600 text-white text-sm"

                  >

                    Remove

                  </button>



                </div>



                <div className="grid grid-cols-2 gap-3 mb-3">



                  <div>

                    <label className="block text-xs font-medium mb-1">

                      Selection Type

                    </label>



                    <select

                      value={group.type}

                      onChange={(e) =>

                        updateOptionGroup(

                          formType,

                          groupIndex,

                          {

                            type:

                              e.target.value as FoodOptionType,

                          }

                        )

                      }

                      className="w-full border rounded-lg px-3 py-2 bg-white"

                    >

                      <option value="radio">

                        Radio - choose one

                      </option>



                      <option value="checkbox">

                        Checkbox - choose multiple

                      </option>

                    </select>

                  </div>



                  <label className="flex items-center gap-2 mt-6">



                    <input

                      type="checkbox"

                      checked={

                        group.required ??

                        false

                      }

                      onChange={(e) =>

                        updateOptionGroup(

                          formType,

                          groupIndex,

                          {

                            required:

                              e.target.checked,

                          }

                        )

                      }

                      className="w-4 h-4"

                    />



                    <span className="text-sm">

                      Required

                    </span>



                  </label>



                </div>



                <div className="space-y-2">



                  <div className="flex justify-between items-center">



                    <span className="text-xs font-bold uppercase">

                      Choices

                    </span>



                    <button

                      type="button"

                      onClick={() =>

                        addOptionChoice(

                          formType,

                          groupIndex

                        )

                      }

                      className="text-sm font-medium text-blue-600"

                    >

                      + Add Choice

                    </button>



                  </div>



                  {group.choices.map(

                    (

                      choice,

                      choiceIndex

                    ) => (



                      <div

                        key={choice.id}

                        className="flex gap-2"

                      >



                        <input

                          type="text"

                          value={

                            choice.name

                          }

                          onChange={(e) =>

                            updateOptionChoice(

                              formType,

                              groupIndex,

                              choiceIndex,

                              {

                                name: e.target.value,

                              }

                            )

                          }

                          className="flex-1 border rounded-lg px-3 py-2 bg-white"

                          placeholder="Choice name"

                        />



                        <input

                          type="number"

                          min="0"

                          value={

                            choice.price

                          }

                          onChange={(e) =>

                            updateOptionChoice(

                              formType,

                              groupIndex,

                              choiceIndex,

                              {

                                price:

                                  Number(

                                    e.target.value

                                  ) || 0,

                              }

                            )

                          }

                          className="w-28 border rounded-lg px-3 py-2 bg-white"

                          placeholder="Price"

                        />



                        <button

                          type="button"

                          onClick={() =>

                            removeOptionChoice(

                              formType,

                              groupIndex,

                              choiceIndex

                            )

                          }

                          className="px-3 rounded-lg bg-red-100 text-red-600"

                        >

                          ×

                        </button>



                      </div>



                    )

                  )}



                  {group.choices.length === 0 && (

                    <p className="text-xs text-gray-500">

                      No choices added yet.

                    </p>

                  )}



                </div>



              </div>



            )

          )}



          {options.length === 0 && (

            <div className="border border-dashed rounded-xl p-5 text-center text-sm text-gray-500">

              This product has no customization options.

              <br />

              Click "Add Group" to create one.

            </div>

          )}



        </div>



      </div>

    )

  }



  // -----------------------------------------

  // LOADING

  // -----------------------------------------



  if (loading) {

    return (

      <div className="p-6">

        <p>Loading products...</p>

      </div>

    )

  }



  // -----------------------------------------

  // ERROR

  // -----------------------------------------



  if (errorMsg) {

    return (

      <div className="p-6">

        <p className="text-red-600">

          {errorMsg}

        </p>

      </div>

    )

  }



  // -----------------------------------------

  // MAIN UI

  // -----------------------------------------



  return (
    <div className="yelo-admin-products p-6">
      <style>{`
        .yelo-admin-products {
          --yelo-red: #c91525;
          --yelo-dark-red: #a70e1b;
          --yelo-yellow: #ffcf24;
          --yelo-cream: #fffaf0;
          --yelo-ink: #281d1d;
          width: 100%; min-width: 0; color: var(--yelo-ink);
          background: var(--yelo-cream); border-radius: 18px;
          overflow-wrap: anywhere;
        }
        .yelo-admin-products h2, .yelo-admin-products h3 { color: var(--yelo-ink); }
        .yelo-admin-products input:not([type="checkbox"]):not([type="file"]),
        .yelo-admin-products select, .yelo-admin-products textarea {
          max-width: 100%; min-width: 0; border-color: #eadfdf; border-radius: 10px;
          color: var(--yelo-ink); background-color: #fffdfb;
        }
        .yelo-admin-products input:focus, .yelo-admin-products select:focus,
        .yelo-admin-products textarea:focus {
          outline: none; border-color: var(--yelo-red);
          box-shadow: 0 0 0 3px rgba(201,21,37,.09);
        }
        .yelo-admin-products button { transition: background-color .18s, transform .18s, box-shadow .18s; }
        .yelo-admin-products button:disabled { cursor: not-allowed; opacity: .6; }
        .yelo-admin-products .bg-green-600, .yelo-admin-products .bg-green-700,
        .yelo-admin-products .bg-blue-600, .yelo-admin-products .bg-blue-700,
        .yelo-admin-products .bg-black {
          background: var(--yelo-red) !important; color: var(--yelo-yellow) !important;
        }
        .yelo-admin-products .bg-green-600:hover, .yelo-admin-products .bg-green-700:hover,
        .yelo-admin-products .bg-blue-600:hover, .yelo-admin-products .bg-blue-700:hover,
        .yelo-admin-products .bg-black:hover { background: var(--yelo-dark-red) !important; }
        .yelo-admin-products .bg-red-600, .yelo-admin-products .bg-red-700,
        .yelo-admin-products .bg-red-800 { background: var(--yelo-red) !important; color: white !important; }
        .yelo-admin-products .text-blue-600, .yelo-admin-products .text-blue-700 { color: var(--yelo-red) !important; }
        .yelo-admin-products .focus\:ring-black:focus { --tw-ring-color: rgba(201,21,37,.15) !important; }
        .yelo-admin-products .bg-white.border, .yelo-admin-products .bg-white.rounded-2xl,
        .yelo-admin-products .border.rounded-xl, .yelo-admin-products .border.border-dashed {
          border-color: #f0dfd8; border-radius: 16px;
        }
        .yelo-admin-products .bg-white.border.rounded-xl {
          box-shadow: 0 8px 24px rgba(73,26,20,.055); padding: 20px;
        }
        .yelo-admin-products .fixed.inset-0 { overflow-y: auto; }
        .yelo-admin-products .fixed.inset-0 > div {
          border: 1px solid #f0dfd8; border-radius: 20px;
        }
        .yelo-admin-products input[type="checkbox"] { accent-color: var(--yelo-red); }
        @media (max-width: 760px) {
          .yelo-admin-products { padding: 16px !important; border-radius: 14px; }
          .yelo-admin-products > .flex.justify-between.items-center.mb-6 {
            align-items: stretch; flex-direction: column; gap: 18px;
          }
          .yelo-admin-products > .flex.justify-between.items-center.mb-6 > .flex.gap-2 {
            display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .yelo-admin-products > .flex.justify-between.items-center.mb-6 > .flex.gap-2 button { min-width: 0; }
          .yelo-admin-products .bg-white.border.rounded-xl > .flex.justify-between.gap-4 {
            flex-direction: column; align-items: stretch; gap: 16px;
          }
          .yelo-admin-products .bg-white.border.rounded-xl > .flex.justify-between.gap-4 > .flex.gap-4 {
            min-width: 0; align-items: flex-start;
          }
          .yelo-admin-products .bg-white.border.rounded-xl > .flex.justify-between.gap-4 > .flex.flex-col.items-end {
            align-items: stretch; width: 100%;
          }
          .yelo-admin-products .bg-white.border.rounded-xl .flex.gap-2 { flex-wrap: wrap; }
          .yelo-admin-products .bg-white.border.rounded-xl .flex.gap-2 button { flex: 1 1 auto; }
          .yelo-admin-products .fixed.inset-0 { align-items: flex-start; padding: 10px !important; }
          .yelo-admin-products .fixed.inset-0 > div { max-height: calc(100dvh - 20px); padding: 18px !important; }
          .yelo-admin-products .grid.grid-cols-2 { grid-template-columns: minmax(0, 1fr); }
          .yelo-admin-products .grid.grid-cols-2 label { margin-top: 0; }
          .yelo-admin-products .flex.gap-2 input.w-28 { width: 90px; }
        }
        @media (max-width: 440px) {
          .yelo-admin-products { padding: 12px !important; }
          .yelo-admin-products > .flex.justify-between.items-center.mb-6 > .flex.gap-2 { grid-template-columns: 1fr; }
          .yelo-admin-products .bg-white.border.rounded-xl > .flex.justify-between.gap-4 > .flex.gap-4 { flex-direction: column; }
          .yelo-admin-products .bg-white.border.rounded-xl img,
          .yelo-admin-products .bg-white.border.rounded-xl .w-24.h-24 { width: 100%; max-width: 100%; height: 180px; }
          .yelo-admin-products .bg-white.border.rounded-xl .flex.gap-2 button { width: 100%; }
          .yelo-admin-products .flex.gap-2 input.w-28 { width: 76px; }
        }
      `}</style>

      {/* HEADER */}



      <div className="flex justify-between items-center mb-6">



        <div>

          <h2 className="text-2xl font-bold">

            Products

          </h2>



          <p className="text-gray-500">

            Manage your menu products

          </p>

        </div>



        <div className="flex gap-2 mt-12">



          <button

            onClick={openAddModal}

            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"

          >

            + Add Product

          </button>



          <button

            onClick={importProducts}

            className="px-4 py-2 rounded-lg bg-black text-white hover:opacity-90"

          >

            Import Menu

          </button>



          <button

            onClick={fetchProducts}

            className="px-4 py-2 rounded-lg border hover:bg-gray-50"

          >

            Refresh

          </button>



        </div>



      </div>

      {/* PRODUCT SEARCH */}

<div className="mb-6">

  <label

    htmlFor="product-search"

    className="block text-sm font-medium mb-2"

  >

    Search products

  </label>



  <div className="flex gap-2">

    <input

      id="product-search"

      type="text"

      value={searchTerm}

      onChange={(e) => setSearchTerm(e.target.value)}

      placeholder="Search by product name or category..."

      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"

    />



    {searchTerm && (

      <button

        type="button"

        onClick={() => setSearchTerm('')}

        className="whitespace-nowrap rounded-lg border px-2 py-1 hover:bg-gray-50"

      >

        clear

      </button>

    )}

  </div>



  <p className="mt-2 text-sm text-gray-500">

    {filteredProducts.length} of {products.length} products

  </p>

</div>



      {/* PRODUCTS */}



      {products.length === 0 ? (

  <div className="border rounded-xl p-6 bg-gray-50">

    <p className="text-gray-600">No products found.</p>

    <p className="text-sm text-gray-500 mt-2">

      Click "Add Product" to add products.

    </p>

  </div>

) : filteredProducts.length === 0 ? (

  <div className="border border-dashed rounded-xl p-8 text-center">

    <p className="font-semibold">No matching products found.</p>

    <p className="mt-1 text-sm text-gray-500">

      Try another product name or category.

    </p>

    <button

      type="button"

      onClick={() => setSearchTerm('')}

      className="mt-4 rounded-lg border px-4 py-2 hover:bg-gray-50"

    >

      Clear Search

    </button>

  </div>

) : (

        <div className="space-y-4">



          {filteredProducts.map((product) => (



            <div

              key={product.id}

              className="bg-white border rounded-xl p-5 shadow-sm"

            >



              <div className="flex justify-between gap-4">



                {/* PRODUCT INFORMATION */}



                <div className="flex gap-4">



                  {product.image_url ? (

                    <img

                      src={product.image_url}

                      alt={product.name}

                      className="w-24 h-24 object-cover rounded-xl border"

                    />

                  ) : (

                    <div className="w-24 h-24 rounded-xl border bg-gray-100 flex items-center justify-center text-gray-400 text-xs text-center">

                      No Image

                    </div>

                  )}



                  <div>



                    <h3 className="text-lg font-bold">

                      {product.name}

                    </h3>



                    <p className="text-sm text-gray-500">

                      {product.category}

                    </p>



                    <p className="font-semibold mt-2">

                      ₦

                      {Number(

                        product.price

                      ).toLocaleString()}

                    </p>



                    <div className="flex flex-wrap gap-2 mt-2">



                      <span className="text-sm text-yellow-600">

                        ⭐ {Number(

                          product.rating ?? 0

                        ).toFixed(1)}

                      </span>



                      {product.prep_time && (

                        <span className="text-sm text-gray-500">

                          ⏱ {product.prep_time}

                        </span>

                      )}



                      {product.is_featured && (

                        <span className="text-sm text-blue-600 font-medium">

                          Featured

                        </span>

                      )}



                    </div>



                    {product.description && (

                      <p className="text-sm text-gray-600 mt-2">

                        {product.description}

                      </p>

                    )}



                  </div>

                </div>



                {/* ACTIONS */}



                <div className="flex flex-col items-end gap-3">



                  <span

                    className={`px-3 py-1 rounded-full text-sm ${

                      product.available

                        ? 'bg-green-100 text-green-700'

                        : 'bg-red-100 text-red-700'

                    }`}

                  >

                    {product.available

                      ? 'Available'

                      : 'Unavailable'}

                  </span>



                  <div className="flex gap-2">



                    {/* EDIT */}



                    <button

                      onClick={() =>

                        openEditModal(product)

                      }

                      className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"

                    >

                      Edit

                    </button>



                    {/* AVAILABILITY */}



                    <button

                      onClick={() =>

                        toggleAvailability(

                          product

                        )

                      }

                      disabled={

                        updatingId ===

                        product.id

                      }

                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${

                        product.available

                          ? 'bg-red-600 text-white hover:bg-red-700'

                          : 'bg-green-600 text-white hover:bg-green-700'

                      } ${

                        updatingId ===

                        product.id

                          ? 'opacity-50 cursor-not-allowed'

                          : ''

                      }`}

                    >

                      {updatingId ===

                      product.id

                        ? 'Updating...'

                        : product.available

                          ? 'Mark Unavailable'

                          : 'Mark Available'}

                    </button>



                    {/* DELETE */}



                    <button

                      onClick={() =>

                        deleteProduct(

                          product

                        )

                      }

                      disabled={

                        updatingId ===

                        product.id

                      }

                      className={`px-4 py-2 rounded-lg bg-red-700 text-white text-sm font-medium hover:bg-red-800 ${

                        updatingId ===

                        product.id

                          ? 'opacity-50 cursor-not-allowed'

                          : ''

                      }`}

                    >

                      {updatingId ===

                      product.id

                        ? 'Deleting...'

                        : 'Delete'}

                    </button>



                  </div>



                </div>



              </div>



            </div>



          ))}



        </div>

      )}



      {/* ========================================= */}

      {/* EDIT PRODUCT MODAL */}

      {/* ========================================= */}



      {editingProduct && (



        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">



          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-xl">



            <div className="flex justify-between items-center mb-6">



              <div>



                <h2 className="text-2xl font-bold">

                  Edit Product

                </h2>



                <p className="text-sm text-gray-500 mt-1">

                  Update the product information.

                </p>



              </div>



              <button

                onClick={closeEditModal}

                className="text-gray-500 hover:text-black text-2xl"

              >

                ×

              </button>



            </div>



            <div className="space-y-4">



              {/* NAME */}



              <div>

                <label className="block text-sm font-medium mb-1">

                  Product Name

                </label>



                <input

                  type="text"

                  value={editForm.name}

                  onChange={(e) =>

                    setEditForm({

                      ...editForm,

                      name: e.target.value,

                    })

                  }

                  className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"

                />

              </div>



              {/* CATEGORY */}



              <div>

                <label className="block text-sm font-medium mb-1">

                  Category

                </label>



                <input

                  type="text"

                  value={editForm.category}

                  onChange={(e) =>

                    setEditForm({

                      ...editForm,

                      category:

                        e.target.value,

                    })

                  }

                  className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"

                />

              </div>



              {/* PRICE */}



              <div>

                <label className="block text-sm font-medium mb-1">

                  Price

                </label>



                <input

                  type="number"

                  min="0"

                  value={editForm.price}

                  onChange={(e) =>

                    setEditForm({

                      ...editForm,

                      price:

                        e.target.value,

                    })

                  }

                  className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"

                />

              </div>



              {/* DESCRIPTION */}



              <div>

                <label className="block text-sm font-medium mb-1">

                  Description

                </label>



                <textarea

                  value={

                    editForm.description

                  }

                  onChange={(e) =>

                    setEditForm({

                      ...editForm,

                      description:

                        e.target.value,

                    })

                  }

                  rows={4}

                  className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black resize-none"

                />

              </div>



              {/* RATING */}



              <div>

                <label className="block text-sm font-medium mb-1">

                  Rating

                </label>



                <input

                  type="number"

                  min="0"

                  max="5"

                  step="0.1"

                  value={editForm.rating}

                  onChange={(e) =>

                    setEditForm({

                      ...editForm,

                      rating:

                        e.target.value,

                    })

                  }

                  className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"

                  placeholder="e.g. 4.8"

                />



                <p className="text-xs text-gray-500 mt-1">

                  Enter a rating from 0 to 5.

                </p>

              </div>



              {/* PREPARATION TIME */}



              <div>

                <label className="block text-sm font-medium mb-1">

                  Preparation Time

                </label>



                <input

                  type="text"

                  value={

                    editForm.prep_time

                  }

                  onChange={(e) =>

                    setEditForm({

                      ...editForm,

                      prep_time:

                        e.target.value,

                    })

                  }

                  className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"

                  placeholder="e.g. 15 mins"

                />

              </div>



              {/* FEATURED */}



              <label className="flex items-center gap-3 cursor-pointer">



                <input

                  type="checkbox"

                  checked={

                    editForm.is_featured

                  }

                  onChange={(e) =>

                    setEditForm({

                      ...editForm,

                      is_featured:

                        e.target.checked,

                    })

                  }

                  className="w-5 h-5"

                />



                <span className="text-sm font-medium">

                  Featured product

                </span>



              </label>



              {/* IMAGE */}



              <div>



                <label className="block text-sm font-medium mb-2">

                  Product Image

                </label>



                <input

                  ref={editImageInputRef}

                  type="file"

                  accept="image/*"

                  onChange={

                    handleEditImageChange

                  }

                  className="hidden"

                />



                <button

                  type="button"

                  onClick={() =>

                    editImageInputRef.current?.click()

                  }

                  className="px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 font-medium"

                >

                  Choose Image

                </button>



                {editImageFile && (

                  <p className="text-sm text-gray-500 mt-2">

                    Selected:{' '}

                    {editImageFile.name}

                  </p>

                )}



                {editImagePreview && (

                  <div className="mt-3">



                    <img

                      src={

                        editImagePreview

                      }

                      alt="Product preview"

                      className="w-40 h-40 object-cover rounded-xl border"

                    />



                  </div>

                )}



              </div>



              {/* PRODUCT OPTIONS */}



              {renderOptionsEditor('edit')}



              {/* AVAILABLE */}



              <label className="flex items-center gap-3 cursor-pointer">



                <input

                  type="checkbox"

                  checked={

                    editForm.available

                  }

                  onChange={(e) =>

                    setEditForm({

                      ...editForm,

                      available:

                        e.target.checked,

                    })

                  }

                  className="w-5 h-5"

                />



                <span className="text-sm font-medium">

                  Product is available

                </span>



              </label>



            </div>



            {/* BUTTONS */}



            <div className="flex justify-end gap-3 mt-6">



              <button

                onClick={closeEditModal}

                className="px-5 py-3 rounded-lg border hover:bg-gray-50"

              >

                Cancel

              </button>



              <button

                onClick={saveProduct}

                disabled={

                  updatingId ===

                  editingProduct.id

                }

                className={`px-5 py-3 rounded-lg bg-black text-white hover:opacity-90 ${

                  updatingId ===

                  editingProduct.id

                    ? 'opacity-50 cursor-not-allowed'

                    : ''

                }`}

              >

                {updatingId ===

                editingProduct.id

                  ? 'Saving...'

                  : 'Save Changes'}

              </button>



            </div>



          </div>



        </div>

      )}



      {/* ========================================= */}

      {/* ADD PRODUCT MODAL */}

      {/* ========================================= */}



      {showAddModal && (



        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">



          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-xl">



            <div className="flex justify-between items-center mb-6">



              <div>



                <h2 className="text-2xl font-bold">

                  Add Product

                </h2>



                <p className="text-sm text-gray-500 mt-1">

                  Create a new menu product.

                </p>



              </div>



              <button

                onClick={closeAddModal}

                className="text-gray-500 hover:text-black text-2xl"

              >

                ×

              </button>



            </div>



            <div className="space-y-4">



              {/* NAME */}



              <div>

                <label className="block text-sm font-medium mb-1">

                  Product Name

                </label>



                <input

                  type="text"

                  value={newProduct.name}

                  onChange={(e) =>

                    setNewProduct({

                      ...newProduct,

                      name: e.target.value,

                    })

                  }

                  className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"

                  placeholder="e.g. Chicken Burger"

                />

              </div>



              {/* CATEGORY */}



              <div>

                <label className="block text-sm font-medium mb-1">

                  Category

                </label>



                <input

                  type="text"

                  value={

                    newProduct.category

                  }

                  onChange={(e) =>

                    setNewProduct({

                      ...newProduct,

                      category:

                        e.target.value,

                    })

                  }

                  className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"

                  placeholder="e.g. Burgers"

                />

              </div>



              {/* PRICE */}



              <div>

                <label className="block text-sm font-medium mb-1">

                  Price

                </label>



                <input

                  type="number"

                  min="0"

                  value={

                    newProduct.price

                  }

                  onChange={(e) =>

                    setNewProduct({

                      ...newProduct,

                      price:

                        e.target.value,

                    })

                  }

                  className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"

                  placeholder="Enter price"

                />

              </div>



              {/* DESCRIPTION */}



              <div>

                <label className="block text-sm font-medium mb-1">

                  Description

                </label>



                <textarea

                  value={

                    newProduct.description

                  }

                  onChange={(e) =>

                    setNewProduct({

                      ...newProduct,

                      description:

                        e.target.value,

                    })

                  }

                  rows={4}

                  className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black resize-none"

                  placeholder="Describe the product"

                />

              </div>



              {/* RATING */}



              <div>

                <label className="block text-sm font-medium mb-1">

                  Rating

                </label>



                <input

                  type="number"

                  min="0"

                  max="5"

                  step="0.1"

                  value={

                    newProduct.rating

                  }

                  onChange={(e) =>

                    setNewProduct({

                      ...newProduct,

                      rating:

                        e.target.value,

                    })

                  }

                  className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"

                  placeholder="e.g. 4.8"

                />



                <p className="text-xs text-gray-500 mt-1">

                  Enter a rating from 0 to 5.

                </p>

              </div>



              {/* PREPARATION TIME */}



              <div>

                <label className="block text-sm font-medium mb-1">

                  Preparation Time

                </label>



                <input

                  type="text"

                  value={

                    newProduct.prep_time

                  }

                  onChange={(e) =>

                    setNewProduct({

                      ...newProduct,

                      prep_time:

                        e.target.value,

                    })

                  }

                  className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"

                  placeholder="e.g. 15 mins"

                />

              </div>



              {/* FEATURED */}



              <label className="flex items-center gap-3 cursor-pointer">



                <input

                  type="checkbox"

                  checked={

                    newProduct.is_featured

                  }

                  onChange={(e) =>

                    setNewProduct({

                      ...newProduct,

                      is_featured:

                        e.target.checked,

                    })

                  }

                  className="w-5 h-5"

                />



                <span className="text-sm font-medium">

                  Featured product

                </span>



              </label>



              {/* IMAGE */}



              <div>



                <label className="block text-sm font-medium mb-2">

                  Product Image

                </label>



                <input

                  ref={newImageInputRef}

                  type="file"

                  accept="image/*"

                  onChange={

                    handleNewImageChange

                  }

                  className="hidden"

                />



                <button

                  type="button"

                  onClick={() =>

                    newImageInputRef.current?.click()

                  }

                  className="px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 font-medium"

                >

                  Choose Image

                </button>



                {newImageFile && (

                  <p className="text-sm text-gray-500 mt-2">

                    Selected:{' '}

                    {newImageFile.name}

                  </p>

                )}



                {newImagePreview && (

                  <div className="mt-3">



                    <img

                      src={

                        newImagePreview

                      }

                      alt="Product preview"

                      className="w-40 h-40 object-cover rounded-xl border"

                    />



                  </div>

                )}



              </div>



              {/* PRODUCT OPTIONS */}



              {renderOptionsEditor('new')}



              {/* AVAILABLE */}



              <label className="flex items-center gap-3 cursor-pointer">



                <input

                  type="checkbox"

                  checked={

                    newProduct.available

                  }

                  onChange={(e) =>

                    setNewProduct({

                      ...newProduct,

                      available:

                        e.target.checked,

                    })

                  }

                  className="w-5 h-5"

                />



                <span className="text-sm font-medium">

                  Product is available

                </span>



              </label>



            </div>



            {/* BUTTONS */}



            <div className="flex justify-end gap-3 mt-6">



              <button

                onClick={closeAddModal}

                className="px-5 py-3 rounded-lg border hover:bg-gray-50"

              >

                Cancel

              </button>



              <button

                onClick={addProduct}

                disabled={addingProduct}

                className={`px-5 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 ${

                  addingProduct

                    ? 'opacity-50 cursor-not-allowed'

                    : ''

                }`}

              >

                {addingProduct

                  ? 'Adding...'

                  : 'Add Product'}

              </button>



            </div>



          </div>



        </div>

      )}



    </div>

  )

}


