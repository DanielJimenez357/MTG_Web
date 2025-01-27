resource "aws_s3_bucket" "mi_bucket" {
  bucket = "mi-carpeta-terraform"
}

locals {
  files = [for file in fileset("C:/Users/Usuario/Desktop/Varios/Estudios/Grado de informatica/2º Grado DAW/Proyecto Navidad", "**/*") :
    file if (can(regex(".*\\.(tf|tfstate|log)$", file)) == false) && !(startswith(file, "terraform"))]
}

resource "aws_s3_object" "subir_archivos" {
  for_each = { for file in local.files : file => file }
  bucket   = aws_s3_bucket.mi_bucket.bucket
  key      = each.value
  source   = "C:/Users/Usuario/Desktop/Varios/Estudios/Grado de informatica/2º Grado DAW/Proyecto Navidad/${each.value}"
}

