resource "aws_s3_bucket" "mi_bucket" {
  bucket = "mi-carpeta-terraform"
}

resource "aws_s3_object" "subir_archivos" {
  for_each = { for file in fileset("../web", "**/*") : file => file }
  bucket   = aws_s3_bucket.mi_bucket.bucket
  key      = each.value
  source   = "../web${each.value}"
}

