export const typeDefs = `
	union DataUnion = UsersPermissionsUser | Page

	type DeleteResponse {
		documentId: ID
	}

	type Response {
		error: String
		data: DataUnion
		success: Boolean
		statusText: String
	}

	type SendEmailResponse {
		message: String
		success: Boolean
	}

	type ImportProduct {
		documentId: ID
		name: String
		model: String
		error: String
		odoo_product_id: String
	}

	type ImportProductsResponse {
		createdProducts: [ImportProduct]
		existingProducts: [ImportProduct]
		errorsProducts: [ImportProduct]
	}

	type ProductDeletedRelatedDocumentStatus {
		deleted: Int
		failed: Int
	}

	type BulkDeleteProduct {
		inventory: ProductDeletedRelatedDocumentStatus
		shipping: ProductDeletedRelatedDocumentStatus
		price_lists: ProductDeletedRelatedDocumentStatus
		specifications: ProductDeletedRelatedDocumentStatus
		key_features: ProductDeletedRelatedDocumentStatus
		files: ProductDeletedRelatedDocumentStatus
		images: ProductDeletedRelatedDocumentStatus
	}

	type BulkDelete {
		documentId: ID
		deletedData: BulkDeleteProduct
		errors: BulkDeleteProduct
		productError: String
	}

	type BulkDeleteResponse {
		success: [BulkDelete]
		failed: [BulkDelete]
	}

	type DeleteUsersResponse {
		success: [DeleteResponse]
	}

	input RegisterUserInput {
		email: String!
		username: String!
		password: String!
		businessName: String!
		businessNumber: String!
		businessType: String!
		phone: String!
		street1: String!
		street2: String!
		state: String!
		city: String!
		country: String!
		zipCode: String!
	}

	type CollectionWithProducts {
  documentId: ID!
  title: String
  handle: String!
  sortOrder: String
  productCount: Long
  image: UploadFile
  productFilters(filters: ComponentElementsFilterRuleFiltersInput, pagination: PaginationArg = {}, sort: [String] = []): [ComponentElementsFilterRule]
  products_connection(filters: ProductFiltersInput, pagination: PaginationArg = {}, sort: [String] = []): ProductEntityResponseCollection
  products(filters: ProductFiltersInput, pagination: PaginationArg = {}, sort: [String] = []): [Product]!
  createdAt: DateTime
  updatedAt: DateTime
  publishedAt: DateTime
}


	input ApprovedUserInput {
		account_status: String!
		level: String
		odoo_user_id: String
	}

	input UserAccountDetails {
		odooId: String!
		userPricingLevel: String
	}

	input UserApprovalRequestInputArgs {
		email: String!
		accountStatus: String!
		user: UserAccountDetails
	}

	input FilesFiltersArgs {
		name: String
		mimeTypes: [String]
	}

	input UserFiltersInput {
		email: String
		username: String
	}

	input ImportPriceInput {
		documentId: String
		comparePrice: Float
		price: Float
		min_quantity: Int
		max_quantity: Int
		user_level: String
	}

	input ImportSpecificationInput {
		documentId: String
		value: String
		key: String
	}

	input ImportKeyFeatureInput {
		documentId: String
		feature: String
	}

	input ImportTagsInput {
		documentId: String
		tag: String
	}
	input ImportCollectionsInput {
		documentId: String
		collection: String
	}

	input ImportShippingInput {
		documentId: String
		weight: Float
		height: Float
		width: Float
		length: Float
	}

	input ImportInventoryInput {
		documentId: String
		melbourne: Int
		sydney: Int
		brisbane: Int
	}

	type ImportPriceListResponse {
		name: String,
		model: String,
		handle: String,
		error: String
	}

	type ImportPriceListResponse {
		createdPriceLists: [ImportPriceListResponse]
		updatedPriceLists: [ImportPriceListResponse]
		errorsPriceLists: [ImportPriceListResponse]
	}



	input ImportPriceListsInput {
		handle: String!
		price_lists: [ImportPriceInput]!
	}

	input ImportProductsInput {
		handle: String
		name: String
		description: String
		product_type: String
		vendor: String
		odoo_product_id: String
		odoo_product_name: String
		model: String
		brand: String
		releasedAt: DateTime
		madeBy: ID
		improvedBy: ID
		removedBy: ID
		maxQuantity: Int
		maxQuantityForLargeShipment: Int
		publishedAt: DateTime
		inventory: ImportInventoryInput
		shipping: ImportShippingInput
		price_lists: [ImportPriceInput]
		key_features: [ImportKeyFeatureInput]
		specifications: [ImportSpecificationInput]
		tags: [ImportTagsInput]
		collections: [ImportCollectionsInput]
		images: [String]
		files: [String]
	}


	input UpdateProductInput {
		alternativeText: String
		name: String
		caption: String
	}
		
	type Mutation {
		registerUser(data: RegisterUserInput!): UsersPermissionsUser
		customProductCreate(data: ImportProductsInput): Product
		customProductUpdate(documentId: ID!, data: ImportProductsInput): Product
		approvedUser(documentId: ID!, data: ApprovedUserInput!): UsersPermissionsUser
		updateUser(documentId: ID!, data: UsersPermissionsUserInput!): UsersPermissionsUser
		deleteUsers(documentIds: [ID]!): DeleteUsersResponse
		deleteUser(documentId: ID!): UsersPermissionsUser
		importProducts(data: [ImportProductsInput]!): ImportProductsResponse
		deleteProducts(documentIds: [ID]!): BulkDeleteResponse
		importPriceLists(data: [ImportPriceListsInput]!): ImportPriceListResponse
		updateFile(documentId: ID!, data: UpdateProductInput): UploadFile
		submitInquery(text: String!, html: String!): SendEmailResponse
		registerForNews(name: String!, companyName: String!, email: String!): SendEmailResponse
	}
	
	type Query {
		searchProducts(query: String!): [Product]!
		getStoreProduct(handle: String!): Product
		getStoreProducts(filters: ProductFiltersInput, pagination: PaginationArg, sort: [String]): [Product]!
		getPage(slug: String!): Page
		getCollectionWithProducts(handle: String!): CollectionWithProducts
		files(filters: UploadFileFiltersInput, sort: [String]): [UploadFile]!
		user(filters: UserFiltersInput): UsersPermissionsUser
	}
`;
