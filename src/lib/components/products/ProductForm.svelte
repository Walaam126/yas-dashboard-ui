<script lang="ts">
	import type { ProductFormValues } from '$lib/schemas';
	import type { Tour } from '$lib/types';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { resolve } from '$app/paths';
	import Field from '$lib/components/shared/Field.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Select } from '$lib/components/ui/select';
	import { Switch } from '$lib/components/ui/switch';
	import { Textarea } from '$lib/components/ui/textarea';
	import { productSchema } from '$lib/schemas';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import ImagePlusIcon from '@lucide/svelte/icons/image-plus';
	import XIcon from '@lucide/svelte/icons/x';
	import { untrack } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	type Props = {
		data: SuperValidated<ProductFormValues>;
		mode: 'create' | 'edit';
		heading: string;
		/** Gallery images seeded from the product being edited. */
		initialGallery: string[];
		galleryOptions: string[];
		tours: Tour[];
	};

	let { data, mode, heading, initialGallery, galleryOptions, tours }: Props = $props();

	// Superforms takes a one-time snapshot of the validated data; the route keys
	// this component on the record id so a new product remounts it.
	const form = superForm(
		untrack(() => data),
		{
			validators: zod4Client(productSchema),
			dataType: 'json',
			resetForm: false,
			onUpdated: ({ form: result }) => {
				if (result.valid && result.message) toast.success(result.message);
			}
		}
	);
	const { form: values, enhance, errors, submitting, allErrors } = form;

	// Gallery is presentation-only in this mockup, so it stays local component state.
	let gallery = $state(untrack(() => [...initialGallery]));
	let nextImage = $state(0);

	let orderTypeHeading = $derived(
		$values.orderType === 'ready'
			? 'Ready to Ship Details'
			: $values.orderType === 'preorder'
				? 'Pre-order Details'
				: 'Tour Details'
	);

	function addImage() {
		if (galleryOptions.length === 0) return;
		gallery = [...gallery, galleryOptions[nextImage % galleryOptions.length]];
		nextImage += 1;
	}

	function removeImage(index: number) {
		gallery = gallery.filter((_, current) => current !== index);
	}
</script>

<a
	href={resolve('/admin/products')}
	class="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-espresso-muted hover:text-espresso"
>
	<ArrowLeftIcon class="h-4 w-4" aria-hidden="true" />
	Back to Products
</a>

<form method="POST" use:enhance>
	<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<h1 class="font-serif text-2xl font-semibold text-espresso sm:text-3xl">{heading}</h1>
		<div class="flex gap-2">
			<Button variant="secondary" href={resolve('/admin/products')}>Cancel</Button>
			<Button type="submit" disabled={$submitting}>
				{#if $submitting}
					Saving…
				{:else}
					{mode === 'edit' ? 'Save Changes' : 'Create Product'}
				{/if}
			</Button>
		</div>
	</div>

	{#if $allErrors.length > 0}
		<div
			class="mb-6 rounded-lg border border-danger-border bg-danger-soft px-4 py-3 text-sm text-danger"
			role="alert"
		>
			Please fix {$allErrors.length}
			{$allErrors.length === 1 ? 'field' : 'fields'} below before saving.
		</div>
	{/if}

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
		<div class="space-y-6 lg:col-span-2">
			<Card>
				<CardHeader title="Basic Information" />
				<div class="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
					<Field id="product-name" label="Product name" errors={$errors.name} class="sm:col-span-2">
						{#snippet control(props)}
							<Input
								{...props}
								name="name"
								bind:value={$values.name}
								placeholder="e.g. Aurélie Structured Tote"
							/>
						{/snippet}
					</Field>

					<Field id="product-brand" label="Brand" errors={$errors.brand}>
						{#snippet control(props)}
							<Input
								{...props}
								name="brand"
								bind:value={$values.brand}
								placeholder="e.g. Aurélie Paris"
							/>
						{/snippet}
					</Field>

					<Field id="product-category" label="Category" errors={$errors.category}>
						{#snippet control(props)}
							<Select {...props} name="category" bind:value={$values.category}>
								<option value="Women">Women</option>
								<option value="Men">Men</option>
								<option value="Kids">Kids</option>
							</Select>
						{/snippet}
					</Field>

					<Field id="product-type" label="Product type" errors={$errors.productType}>
						{#snippet control(props)}
							<Select {...props} name="productType" bind:value={$values.productType}>
								<option value="Bag">Bag</option>
								<option value="Shoes">Shoes</option>
								<option value="Clothes">Clothes</option>
								<option value="Accessories">Accessories</option>
							</Select>
						{/snippet}
					</Field>

					<Field id="product-order-type" label="Order type" errors={$errors.orderType}>
						{#snippet control(props)}
							<Select {...props} name="orderType" bind:value={$values.orderType}>
								<option value="ready">Ready to Ship</option>
								<option value="preorder">Pre-order</option>
								<option value="tour">Tour</option>
							</Select>
						{/snippet}
					</Field>

					<Field
						id="product-description"
						label="Description"
						errors={$errors.description}
						class="sm:col-span-2"
					>
						{#snippet control(props)}
							<Textarea
								{...props}
								name="description"
								bind:value={$values.description}
								placeholder="Describe the product, materials and fit…"
							/>
						{/snippet}
					</Field>
				</div>
			</Card>

			<Card>
				<CardHeader title="Media" />
				<CardContent>
					<div class="grid grid-cols-3 gap-3 sm:grid-cols-4">
						{#each gallery as src, index (`${src}-${index}`)}
							<div
								class="group relative aspect-square overflow-hidden rounded-lg border border-beige-border"
							>
								<img
									{src}
									alt="Product image {index + 1}"
									class="h-full w-full object-cover"
									loading="lazy"
								/>
								{#if index === 0}
									<span
										class="absolute top-1.5 left-1.5 rounded bg-espresso/80 px-1.5 py-0.5 text-[10px] font-medium text-cream"
									>
										Main
									</span>
								{/if}
								<button
									type="button"
									onclick={() => removeImage(index)}
									class="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-espresso/70 text-cream opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
								>
									<XIcon class="h-3.5 w-3.5" aria-hidden="true" />
									<span class="sr-only">Remove image {index + 1}</span>
								</button>
							</div>
						{/each}
						<button
							type="button"
							onclick={addImage}
							class="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-beige-border text-espresso-muted transition-colors hover:border-gold hover:text-gold-dark"
						>
							<ImagePlusIcon class="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
							<span class="text-xs">Add</span>
						</button>
					</div>
					<p class="mt-3 text-xs text-espresso-muted">
						The first image is the main image. Remove an image with the button in its corner.
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader title="Pricing" />
				<div class="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3">
					<Field id="product-price" label="Regular price (BHD)" errors={$errors.price}>
						{#snippet control(props)}
							<Input
								{...props}
								name="price"
								type="number"
								step="0.001"
								min="0"
								bind:value={$values.price}
								placeholder="0.000"
							/>
						{/snippet}
					</Field>

					<Field
						id="product-sale-price"
						label="Sale price (BHD)"
						hint="Optional"
						errors={$errors.salePrice}
					>
						{#snippet control(props)}
							<Input
								{...props}
								name="salePrice"
								type="number"
								step="0.001"
								min="0"
								bind:value={$values.salePrice}
								placeholder="0.000"
							/>
						{/snippet}
					</Field>

					<Field
						id="product-cost-price"
						label="Cost price (BHD)"
						hint="Internal only"
						errors={$errors.costPrice}
					>
						{#snippet control(props)}
							<Input
								{...props}
								name="costPrice"
								type="number"
								step="0.001"
								min="0"
								bind:value={$values.costPrice}
								placeholder="0.000"
							/>
						{/snippet}
					</Field>
				</div>
			</Card>

			<Card>
				<CardHeader title="Variants & Stock" />
				<div class="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
					<Field
						id="product-colors"
						label="Colors"
						hint="Comma separated"
						errors={$errors.colors}
						class="sm:col-span-2"
					>
						{#snippet control(props)}
							<Input
								{...props}
								name="colors"
								bind:value={$values.colors}
								placeholder="Tan, Black, Cream"
							/>
						{/snippet}
					</Field>

					<Field
						id="product-sizes"
						label="Sizes"
						hint="Comma separated"
						errors={$errors.sizes}
						class="sm:col-span-2"
					>
						{#snippet control(props)}
							<Input
								{...props}
								name="sizes"
								bind:value={$values.sizes}
								placeholder="S, M, L / 40, 41, 42"
							/>
						{/snippet}
					</Field>

					<Field id="product-sku" label="SKU" errors={$errors.sku}>
						{#snippet control(props)}
							<Input {...props} name="sku" bind:value={$values.sku} placeholder="AUR-TOTE-TAN" />
						{/snippet}
					</Field>

					<Field
						id="product-low-stock"
						label="Low-stock threshold"
						errors={$errors.lowStockThreshold}
					>
						{#snippet control(props)}
							<Input
								{...props}
								name="lowStockThreshold"
								type="number"
								min="0"
								bind:value={$values.lowStockThreshold}
								disabled={!$values.trackInventory}
							/>
						{/snippet}
					</Field>

					<Field id="product-stock" label="Stock quantity" errors={$errors.stock}>
						{#snippet control(props)}
							<Input
								{...props}
								name="stock"
								type="number"
								min="0"
								bind:value={$values.stock}
								disabled={!$values.trackInventory}
							/>
						{/snippet}
					</Field>

					<div
						class="flex items-center justify-between gap-3 rounded-lg border border-beige-border bg-cream-100 px-3 sm:col-span-2"
					>
						<div class="py-3">
							<p class="text-sm font-medium text-espresso">Track inventory</p>
							<p class="text-xs text-espresso-muted">Disable for Pre-order or Tour products.</p>
						</div>
						<Switch
							name="trackInventory"
							bind:checked={$values.trackInventory}
							aria-label="Track inventory"
						/>
					</div>
				</div>
			</Card>

			<Card>
				<CardHeader title={orderTypeHeading} />
				<div class="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
					{#if $values.orderType === 'ready'}
						<Field id="product-current-stock" label="Current stock" errors={$errors.stock}>
							{#snippet control(props)}
								<Input {...props} type="number" min="0" bind:value={$values.stock} />
							{/snippet}
						</Field>
						<Field
							id="product-delivery-availability"
							label="Delivery availability"
							errors={$errors.deliveryAvailability}
						>
							{#snippet control(props)}
								<Select
									{...props}
									name="deliveryAvailability"
									bind:value={$values.deliveryAvailability}
								>
									<option value="same_day">Same-day available</option>
									<option value="standard">Standard (1–3 days)</option>
								</Select>
							{/snippet}
						</Field>
					{:else if $values.orderType === 'preorder'}
						<Field
							id="product-expected-arrival"
							label="Expected arrival"
							errors={$errors.expectedArrival}
						>
							{#snippet control(props)}
								<Input
									{...props}
									name="expectedArrival"
									type="date"
									bind:value={$values.expectedArrival}
								/>
							{/snippet}
						</Field>
						<Field
							id="product-order-deadline"
							label="Order deadline"
							errors={$errors.orderDeadline}
						>
							{#snippet control(props)}
								<Input
									{...props}
									name="orderDeadline"
									type="date"
									bind:value={$values.orderDeadline}
								/>
							{/snippet}
						</Field>
						<Field
							id="product-deposit"
							label="Required deposit (BHD)"
							errors={$errors.depositAmount}
						>
							{#snippet control(props)}
								<Input
									{...props}
									name="depositAmount"
									type="number"
									step="0.001"
									min="0"
									bind:value={$values.depositAmount}
									placeholder="0.000"
								/>
							{/snippet}
						</Field>
						<Field
							id="product-preorder-notice"
							label="Pre-order notice"
							errors={$errors.preorderNotice}
							class="sm:col-span-2"
						>
							{#snippet control(props)}
								<Textarea
									{...props}
									name="preorderNotice"
									bind:value={$values.preorderNotice}
									placeholder="Message shown to customers about expected timing…"
								/>
							{/snippet}
						</Field>
					{:else}
						<Field id="product-tour" label="Connected tour" errors={$errors.tourId}>
							{#snippet control(props)}
								<Select {...props} name="tourId" bind:value={$values.tourId}>
									<option value="">Choose a tour…</option>
									{#each tours as tour (tour.id)}
										<option value={tour.id}>{tour.name}</option>
									{/each}
								</Select>
							{/snippet}
						</Field>
						<Field
							id="product-request-deadline"
							label="Request deadline"
							errors={$errors.orderDeadline}
						>
							{#snippet control(props)}
								<Input
									{...props}
									name="orderDeadline"
									type="date"
									bind:value={$values.orderDeadline}
								/>
							{/snippet}
						</Field>
						<Field
							id="product-estimated-arrival"
							label="Estimated arrival"
							errors={$errors.expectedArrival}
						>
							{#snippet control(props)}
								<Input
									{...props}
									name="expectedArrival"
									type="date"
									bind:value={$values.expectedArrival}
								/>
							{/snippet}
						</Field>
						<Field
							id="product-tour-deposit"
							label="Required deposit (BHD)"
							errors={$errors.depositAmount}
						>
							{#snippet control(props)}
								<Input
									{...props}
									name="depositAmount"
									type="number"
									step="0.001"
									min="0"
									bind:value={$values.depositAmount}
									placeholder="0.000"
								/>
							{/snippet}
						</Field>
					{/if}
				</div>
			</Card>
		</div>

		<div class="space-y-6">
			<Card>
				<CardHeader title="Visibility" />
				<div class="space-y-4 p-5">
					<Field id="product-visibility" label="Status" errors={$errors.visibility}>
						{#snippet control(props)}
							<Select {...props} name="visibility" bind:value={$values.visibility}>
								<option value="published">Published</option>
								<option value="draft">Draft</option>
								<option value="hidden">Hidden</option>
							</Select>
						{/snippet}
					</Field>
					<div
						class="flex items-center justify-between gap-3 rounded-lg border border-beige-border bg-cream-100 px-3 py-3"
					>
						<div>
							<p class="text-sm font-medium text-espresso">Featured product</p>
							<p class="text-xs text-espresso-muted">Highlight on the storefront.</p>
						</div>
						<Switch name="featured" bind:checked={$values.featured} aria-label="Featured product" />
					</div>
				</div>
			</Card>

			<Card>
				<div class="space-y-2 p-5">
					<Button type="submit" class="w-full" disabled={$submitting}>
						{#if $submitting}
							Saving…
						{:else}
							{mode === 'edit' ? 'Save Changes' : 'Create Product'}
						{/if}
					</Button>
					<Button variant="secondary" class="w-full" href={resolve('/admin/products')}>
						Cancel
					</Button>
				</div>
			</Card>
		</div>
	</div>
</form>
